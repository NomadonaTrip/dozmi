/* ======================================================================
   Dynamically loads the latest video from the DOZMI YouTube channel
   into the Featured Sermon section on the home page.

   How it works:
   1. Fetches the channel's public RSS feed via a CORS proxy
   2. Parses the XML to extract the most recent upload
   3. Updates the sermon title, thumbnail, link and date in the DOM
   4. Falls back silently to whatever is already in the HTML

   No API key required — uses YouTube's public Atom feed.
   ====================================================================== */

(function () {
  const CHANNEL_ID = "UC1kh7UrdzbTBB_we3npIcJQ";
  const RSS_URL =
    "https://www.youtube.com/feeds/videos.xml?channel_id=" + CHANNEL_ID;

  /*
   * CORS proxies — tried in order; first success wins.
   * Each entry: { url(rss), parse(response) → Promise<xmlString> }
   */
  var PROXIES = [
    {
      /* allorigins wraps the result in JSON { contents: "..." } */
      url: function (rss) {
        return "https://api.allorigins.win/get?url=" + encodeURIComponent(rss);
      },
      parse: function (res) {
        return res.json().then(function (j) { return j.contents; });
      },
    },
    {
      /* corsproxy.io returns the raw XML as text */
      url: function (rss) {
        return "https://corsproxy.io/?" + encodeURIComponent(rss);
      },
      parse: function (res) {
        return res.text();
      },
    },
  ];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    var host = document.querySelector("[data-latest-sermon]");
    if (!host) return;
    fetchFeed(0, host);
  }

  function fetchFeed(proxyIdx, host) {
    if (proxyIdx >= PROXIES.length) {
      /* All proxies failed — keep the static fallback content */
      return;
    }

    var proxy = PROXIES[proxyIdx];

    fetch(proxy.url(RSS_URL))
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return proxy.parse(res);
      })
      .then(function (xmlText) {
        if (!xmlText) throw new Error("Empty response");
        var entry = parseLatestEntry(xmlText);
        if (!entry) throw new Error("No entries found");
        render(host, entry);
      })
      .catch(function () {
        /* Try next proxy */
        fetchFeed(proxyIdx + 1, host);
      });
  }

  function parseLatestEntry(xmlText) {
    var parser = new DOMParser();
    var xml = parser.parseFromString(xmlText, "text/xml");
    var entries = xml.querySelectorAll("entry");
    if (!entries.length) return null;

    var entry = entries[0];
    var title = getText(entry, "title");
    var videoId = getText(entry, "yt\\:videoId") || getText(entry, "videoId");
    var published = getText(entry, "published");
    var author = getText(entry, "author > name") || "Pastor Sanmi Adetukasi";

    /* Fallback: extract videoId from the <id> tag (yt:video:XXXX) */
    if (!videoId) {
      var idText = getText(entry, "id");
      if (idText) {
        var parts = idText.split(":");
        videoId = parts[parts.length - 1];
      }
    }

    if (!videoId) return null;

    return {
      title: title,
      videoId: videoId,
      published: published,
      author: author,
      url: "https://www.youtube.com/watch?v=" + videoId,
      thumbnail: "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg",
    };
  }

  function getText(parent, selector) {
    var el = parent.querySelector(selector);
    return el ? el.textContent.trim() : "";
  }

  function render(host, entry) {
    /* Format the date */
    var dateLabel = "Recent";
    if (entry.published) {
      var d = new Date(entry.published);
      if (!isNaN(d)) {
        dateLabel = d.toLocaleDateString("en-CA", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }
    }

    /* Update the link + thumbnail */
    var link = host.querySelector("[data-sermon-link]");
    if (link) {
      link.href = entry.url;
      var img = link.querySelector("img");
      if (img) {
        img.src = entry.thumbnail;
        img.alt = entry.title + " — DOZMI The Revival Center";
      }
    }

    /* Update the title */
    var titleEl = host.querySelector("[data-sermon-title]");
    if (titleEl) {
      titleEl.textContent = entry.title;
    }

    /* Update the date */
    var dateEl = host.querySelector("[data-sermon-date]");
    if (dateEl) {
      dateEl.textContent = dateLabel;
    }

    /* Update the speaker */
    var speakerEl = host.querySelector("[data-sermon-speaker]");
    if (speakerEl && entry.author) {
      speakerEl.textContent = entry.author;
    }

    /* Update the watch button link */
    var watchBtn = host.querySelector("[data-sermon-watch]");
    if (watchBtn) {
      watchBtn.href = entry.url;
    }
  }
})();
