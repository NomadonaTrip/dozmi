/* ======================================================================
   Shared YouTube RSS feed utility for DOZMI.
   Fetches the channel's public Atom feed via CORS proxies and parses
   entries into a clean array of objects.

   Usage:
     // Returning visitors: show cached data instantly.
     var cached = DOZMI_YT_FEED.getCached(7);
     if (cached) renderFromArray(cached);

     // Fresh fetch — replaces cached render when it resolves.
     DOZMI_YT_FEED.fetchEntries(7).then(function(entries) { ... });

   Each entry: { title, videoId, published, author, url, thumbnail }
   ====================================================================== */

window.DOZMI_YT_FEED = (function () {
  var CHANNEL_ID = "UC1kh7UrdzbTBB_we3npIcJQ";
  var RSS_URL =
    "https://www.youtube.com/feeds/videos.xml?channel_id=" + CHANNEL_ID;
  var CACHE_KEY = "dozmi_yt_feed_v1";

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
     On success, caches the full parsed feed in localStorage so returning
     visitors see the last-known-good data instantly next time — and keep
     seeing it if every proxy is down.
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
            var entries = parseAllEntries(xmlText);
            if (!entries.length) throw new Error("No entries found");
            writeCache(entries);
            resolve(entries.slice(0, max));
          })
          .catch(function () {
            tryProxy(idx + 1);
          });
      }
    });
  }

  /* ------------------------------------------------------------------
     getCached(max)
     Synchronously returns up to `max` cached entries from localStorage,
     or null if no cache exists or it's unreadable.
     ------------------------------------------------------------------ */
  function getCached(max) {
    var entries = readCache();
    if (!entries) return null;
    return max ? entries.slice(0, max) : entries;
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.entries) || !parsed.entries.length) {
        return null;
      }
      return parsed.entries;
    } catch (e) {
      return null;
    }
  }

  function writeCache(entries) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), entries: entries })
      );
    } catch (e) {
      /* storage disabled, private mode, or quota exceeded — swallow */
    }
  }

  /* ------------------------------------------------------------------
     parseAllEntries(xmlText)
     Parses YouTube Atom XML into an array of entry objects.
     ------------------------------------------------------------------ */
  function parseAllEntries(xmlText) {
    var parser = new DOMParser();
    var xml = parser.parseFromString(xmlText, "text/xml");
    var nodes = xml.querySelectorAll("entry");
    var entries = [];

    for (var i = 0; i < nodes.length; i++) {
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
    getCached: getCached,
    formatDate: formatDate,
    escapeHtml: escapeHtml,
  };
})();
