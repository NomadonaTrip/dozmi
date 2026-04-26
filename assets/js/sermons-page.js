/* ======================================================================
   Sermons page controller.
   Fetches the 7 most recent videos from the DOZMI YouTube channel,
   renders the featured message + 6 card grid, and wires up category
   filter buttons. Depends on yt-feed.js (loaded first).
   Falls back silently to static HTML if the feed fetch fails.
   ====================================================================== */

(function () {
  /* --- Category classification rules (checked in order) --- */
  var RULES = [
    { pattern: /prayer|pray|intercession/i, category: "Prayer" },
    { pattern: /bible\s*study|book\s*of|study/i, category: "Teaching" },
    { pattern: /sunday|easter|christmas|service|sermon/i, category: "Series" },
    { pattern: /revival|worship|night\s*of|praise/i, category: "Revival" },
  ];
  var DEFAULT_CATEGORY = "Teaching";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    if (typeof DOZMI_YT_FEED === "undefined") return;
    /* Only run on pages that have the sermons grid */
    if (!document.querySelector("[data-sermons-grid]")) return;

    /* Paint from cache immediately so returning visitors don't wait on the
       network — and so they still see real content if every proxy is down. */
    var cached = DOZMI_YT_FEED.getCached(7);
    if (cached && cached.length) {
      renderFeatured(cached[0]);
      renderGrid(cached.slice(1, 7));
      injectVideoSchema(cached);
    }

    /* Filter handlers query cards at click time, so wire them once up front. */
    initFilters();

    /* Fresh fetch — replaces cached/static render when it resolves. */
    DOZMI_YT_FEED.fetchEntries(7)
      .then(function (entries) {
        if (!entries.length) return;
        renderFeatured(entries[0]);
        renderGrid(entries.slice(1, 7));
        injectVideoSchema(entries);
      })
      .catch(function () {
        /* All proxies failed — cached or static HTML remains. */
      });
  }

  /* ------------------------------------------------------------------
     injectVideoSchema(entries)
     Builds an ItemList of VideoObject schema from live YouTube entries
     and writes it into <head>. Replaces any prior dynamic block so
     schema always matches the rendered page (no stale titles, no
     fabricated dates).
     ------------------------------------------------------------------ */
  function injectVideoSchema(entries) {
    if (!entries || !entries.length) return;
    var SCHEMA_ID = "dozmi-sermons-dynamic-schema";

    var items = [];
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (!e || !e.videoId) continue;
      items.push({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "VideoObject",
          "name": e.title,
          "description":
            (e.title || "Sermon") +
            " — a sermon from DOZMI The Revival Center, a Pentecostal church in Mississauga, Ontario.",
          "thumbnailUrl": e.thumbnail,
          "uploadDate": e.published || undefined,
          "contentUrl": e.url,
          "embedUrl": "https://www.youtube.com/embed/" + e.videoId,
          "publisher": { "@id": "https://dozmi-revivalcenter.ca/#organization" },
          "creator": {
            "@type": "Person",
            "name": e.author || "Pastor Sanmi Adetukasi"
          },
          "inLanguage": "en"
        }
      });
    }
    if (!items.length) return;

    var payload = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://dozmi-revivalcenter.ca/sermons.html#sermons-live",
      "name": "Recent sermons from DOZMI The Revival Center, Mississauga",
      "itemListElement": items
    };

    var existing = document.getElementById(SCHEMA_ID);
    if (existing) existing.parentNode.removeChild(existing);

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify(payload);
    document.head.appendChild(script);
  }

  /* ------------------------------------------------------------------
     Category classifier — matches title against regex rules
     ------------------------------------------------------------------ */
  function classify(title) {
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].pattern.test(title)) return RULES[i].category;
    }
    return DEFAULT_CATEGORY;
  }

  /* ------------------------------------------------------------------
     Featured section (entry 0)
     ------------------------------------------------------------------ */
  function renderFeatured(entry) {
    var container = document.querySelector("[data-sermons-featured]");
    if (!container) return;

    var dateLabel = DOZMI_YT_FEED.formatDate(entry.published);

    var iframe = container.querySelector("[data-featured-iframe]");
    if (iframe) {
      iframe.src = "https://www.youtube.com/embed/" + entry.videoId;
      iframe.title = entry.title + " — DOZMI Revival Center";
    }

    var titleEl = container.querySelector("[data-featured-title]");
    if (titleEl) titleEl.textContent = entry.title;

    var speakerEl = container.querySelector("[data-featured-speaker]");
    if (speakerEl) speakerEl.textContent = entry.author || "Pastor Sanmi Adetukasi";

    var dateEl = container.querySelector("[data-featured-date]");
    if (dateEl) dateEl.textContent = dateLabel;
  }

  /* ------------------------------------------------------------------
     Card grid (entries 1–6)
     ------------------------------------------------------------------ */
  function renderGrid(entries) {
    var grid = document.querySelector("[data-sermons-grid]");
    if (!grid) return;

    var esc = DOZMI_YT_FEED.escapeHtml;

    grid.innerHTML = entries
      .map(function (entry) {
        var cat = classify(entry.title);
        var dateLabel = DOZMI_YT_FEED.formatDate(entry.published);

        return (
          '<article class="event-card" data-category="' + esc(cat) + '">' +
          '  <a href="' + esc(entry.url) + '" target="_blank" rel="noopener" class="block">' +
          '    <div class="thumb">' +
          '      <img src="' + esc(entry.thumbnail) + '" alt="' + esc(entry.title) + '" loading="lazy"' +
          '           onerror="this.onerror=null;this.src=this.src.replace(\'maxresdefault\',\'hqdefault\')" />' +
          '      <div class="absolute inset-0 flex items-center justify-center bg-black/20">' +
          '        <div class="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary shadow-regal">' +
          '          <span class="material-symbols-outlined text-3xl ml-1">play_arrow</span>' +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          '  </a>' +
          '  <div class="p-7">' +
          '    <div class="eyebrow" style="font-size: 9px;">' + esc(cat) + '</div>' +
          '    <h3 class="font-headline text-xl font-black mt-4 text-primary uppercase">' + esc(entry.title) + '</h3>' +
          '    <p class="text-on-surface-variant italic mt-3 text-sm">' + esc(dateLabel) + '</p>' +
          '    <div class="mt-4 flex items-center gap-2 text-xs text-on-surface-variant">' +
          '      <span class="material-symbols-outlined text-secondary text-base">person</span> ' +
          esc(entry.author || "Pastor Sanmi Adetukasi") +
          '    </div>' +
          '  </div>' +
          '</article>'
        );
      })
      .join("");
  }

  /* ------------------------------------------------------------------
     Filter bar
     ------------------------------------------------------------------ */
  function initFilters() {
    var filterBar = document.querySelector("[data-sermons-filter]");
    var grid = document.querySelector("[data-sermons-grid]");
    if (!filterBar || !grid) return;

    var buttons = filterBar.querySelectorAll("button[data-filter]");
    var ACTIVE = "px-5 py-2.5 rounded-full velvet-gradient text-secondary-container shadow-card font-label text-[11px] font-bold uppercase tracking-[0.18em]";
    var INACTIVE = "px-5 py-2.5 rounded-full bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition font-label text-[11px] font-bold uppercase tracking-[0.18em]";

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-filter");

        /* Toggle active styling */
        buttons.forEach(function (b) {
          b.className = INACTIVE;
        });
        btn.className = ACTIVE;

        /* Filter cards */
        var cards = grid.querySelectorAll("article[data-category]");
        var visible = 0;

        cards.forEach(function (card) {
          if (value === "All" || card.getAttribute("data-category") === value) {
            card.style.display = "";
            visible++;
          } else {
            card.style.display = "none";
          }
        });

        /* Empty state */
        var empty = grid.querySelector("[data-empty-state]");
        if (visible === 0) {
          if (!empty) {
            empty = document.createElement("div");
            empty.setAttribute("data-empty-state", "");
            empty.className = "col-span-full text-center py-16";
            empty.innerHTML =
              '<p class="text-on-surface-variant italic text-lg">No messages in this category yet.</p>' +
              '<a href="https://www.youtube.com/@dozmitherevivalcenter" class="btn-ghost mt-6 inline-flex">Browse All on YouTube</a>';
            grid.appendChild(empty);
          }
          empty.style.display = "";
        } else if (empty) {
          empty.style.display = "none";
        }
      });
    });
  }
})();
