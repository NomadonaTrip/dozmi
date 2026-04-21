/* ======================================================================
   Home page: dynamically loads the latest YouTube video into the
   Featured Sermon section. Depends on yt-feed.js (loaded first).
   Falls back silently to static HTML if the feed fetch fails.
   ====================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    var host = document.querySelector("[data-latest-sermon]");
    if (!host || typeof DOZMI_YT_FEED === "undefined") return;

    DOZMI_YT_FEED.fetchEntries(1)
      .then(function (entries) {
        if (entries.length) render(host, entries[0]);
      })
      .catch(function () {
        /* All proxies failed — static fallback remains */
      });
  }

  function render(host, entry) {
    var dateLabel = DOZMI_YT_FEED.formatDate(entry.published);

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
