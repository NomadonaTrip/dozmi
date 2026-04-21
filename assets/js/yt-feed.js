/* ======================================================================
   Shared YouTube RSS feed utility for DOZMI.
   Fetches the channel's public Atom feed via CORS proxies and parses
   entries into a clean array of objects.

   Usage:
     DOZMI_YT_FEED.fetchEntries(7).then(function(entries) { ... });

   Each entry: { title, videoId, published, author, url, thumbnail }
   ====================================================================== */

window.DOZMI_YT_FEED = (function () {
  var CHANNEL_ID = "UC1kh7UrdzbTBB_we3npIcJQ";
  var RSS_URL =
    "https://www.youtube.com/feeds/videos.xml?channel_id=" + CHANNEL_ID;

  var PROXIES = [
    {
      url: function (rss) {
        return "https://api.allorigins.win/get?url=" + encodeURIComponent(rss);
      },
      parse: function (res) {
        return res.json().then(function (j) {
          return j.contents;
        });
      },
    },
    {
      url: function (rss) {
        return "https://corsproxy.io/?" + encodeURIComponent(rss);
      },
      parse: function (res) {
        return res.text();
      },
    },
  ];

  /* ------------------------------------------------------------------
     fetchEntries(max)
     Returns a Promise resolving to an array of up to `max` entry objects.
     Tries each CORS proxy in sequence; rejects if all fail.
     ------------------------------------------------------------------ */
  function fetchEntries(max) {
    max = max || 7;

    return new Promise(function (resolve, reject) {
      tryProxy(0);

      function tryProxy(idx) {
        if (idx >= PROXIES.length) {
          reject(new Error("All CORS proxies failed"));
          return;
        }

        var proxy = PROXIES[idx];

        fetch(proxy.url(RSS_URL))
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return proxy.parse(res);
          })
          .then(function (xmlText) {
            if (!xmlText) throw new Error("Empty response");
            var entries = parseAllEntries(xmlText, max);
            if (!entries.length) throw new Error("No entries found");
            resolve(entries);
          })
          .catch(function () {
            tryProxy(idx + 1);
          });
      }
    });
  }

  /* ------------------------------------------------------------------
     parseAllEntries(xmlText, max)
     Parses YouTube Atom XML into an array of entry objects.
     ------------------------------------------------------------------ */
  function parseAllEntries(xmlText, max) {
    var parser = new DOMParser();
    var xml = parser.parseFromString(xmlText, "text/xml");
    var nodes = xml.querySelectorAll("entry");
    var entries = [];

    for (var i = 0; i < nodes.length && i < max; i++) {
      var node = nodes[i];
      var title = getText(node, "title");
      var videoId =
        getText(node, "yt\\:videoId") || getText(node, "videoId");
      var published = getText(node, "published");
      var author = getText(node, "author > name") || "Pastor Sanmi Adetukasi";

      /* Fallback: extract videoId from <id> tag (yt:video:XXXX) */
      if (!videoId) {
        var idText = getText(node, "id");
        if (idText) {
          var parts = idText.split(":");
          videoId = parts[parts.length - 1];
        }
      }

      if (!videoId) continue;

      entries.push({
        title: title,
        videoId: videoId,
        published: published,
        author: author,
        url: "https://www.youtube.com/watch?v=" + videoId,
        thumbnail:
          "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg",
      });
    }

    return entries;
  }

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function getText(parent, selector) {
    var el = parent.querySelector(selector);
    return el ? el.textContent.trim() : "";
  }

  function formatDate(isoString) {
    if (!isoString) return "Recent";
    var d = new Date(isoString);
    if (isNaN(d)) return "Recent";
    return d.toLocaleDateString("en-CA", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Public API */
  return {
    fetchEntries: fetchEntries,
    formatDate: formatDate,
    escapeHtml: escapeHtml,
  };
})();
