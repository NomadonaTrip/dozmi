/* Site-wide behaviors — sticky header, mobile nav, upcoming events injector */

(function () {
  // Sticky header style
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 10) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile menu
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("[data-mobile-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    const closeBtn = document.querySelector("[data-mobile-close]");
    if (toggle && menu) {
      toggle.addEventListener("click", () => menu.classList.add("is-open"));
    }
    if (closeBtn && menu) {
      closeBtn.addEventListener("click", () => menu.classList.remove("is-open"));
    }
    menu?.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("is-open"))
    );

    // Current year in footer
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    // Inject next-event bar (hero base)
    const nextEventHost = document.querySelector("[data-next-event]");
    if (nextEventHost && typeof window.getUpcomingEvents === "function") {
      const next = window.getUpcomingEvents(1)[0];
      if (next) {
        const [y, m, d] = next.occurrenceDate.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
        const mAbbr = dt
          .toLocaleString("en-US", { month: "short" })
          .toUpperCase();
        const weekday = dt.toLocaleDateString("en-CA", { weekday: "long" });
        nextEventHost.innerHTML = `
          <div class="hero-event-bar-inner">
            <div class="hero-event-date">
              <span class="d">${d}</span>
              <span class="m">${mAbbr}</span>
            </div>
            <div class="hero-event-body">
              <div class="hero-event-label">Next Gathering · ${escape(weekday)}</div>
              <div class="hero-event-title">${escape(next.title)}</div>
              <div class="hero-event-meta">
                <span><span class="material-symbols-outlined">schedule</span>${escape(next.time)}</span>
                <span><span class="material-symbols-outlined">location_on</span>${escape(next.location)}</span>
              </div>
            </div>
            <a href="events.html" class="hero-event-cta">
              View Calendar
              <span class="material-symbols-outlined text-base">arrow_right_alt</span>
            </a>
          </div>
        `;
      }
    }

    // Inject upcoming events
    const upcomingHost = document.querySelector("[data-upcoming-events]");
    if (upcomingHost && typeof window.getUpcomingEvents === "function") {
      const limit = parseInt(upcomingHost.dataset.upcomingEvents || "3", 10);
      const events = window.getUpcomingEvents(limit);
      upcomingHost.innerHTML = events
        .map((ev) => {
          const [y, m, d] = ev.occurrenceDate.split("-").map(Number);
          const dt = new Date(y, m - 1, d);
          const mAbbr = dt.toLocaleString("en-US", { month: "short" }).toUpperCase();
          const thumb =
            ev.image ||
            defaultThumbById(ev.id) ||
            defaultThumb(ev.category) ||
            "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80";
          return `
            <article class="event-card">
              <div class="thumb">
                <img src="${thumb}" alt="${escape(ev.title)}" loading="lazy" />
                <div class="date-chip">
                  <span class="d">${d}</span>
                  <span class="m">${mAbbr}</span>
                </div>
              </div>
              <div class="p-8">
                <h3 class="font-headline text-2xl font-bold text-primary uppercase tracking-tight">${escape(ev.title)}</h3>
                <p class="text-on-surface-variant italic mt-3 text-sm leading-relaxed">${escape(ev.description)}</p>
                <div class="flex items-center gap-2 mt-5 text-xs font-label uppercase tracking-widest text-secondary font-bold">
                  <span class="material-symbols-outlined text-base">schedule</span>
                  <span>${escape(ev.time)}</span>
                </div>
                <div class="flex items-center gap-2 mt-2 text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  <span class="material-symbols-outlined text-base">location_on</span>
                  <span>${escape(ev.location)}</span>
                </div>
              </div>
            </article>
          `;
        })
        .join("");
    }
  });

  function defaultThumbById(id) {
    var map = {
      "sunday-service": "assets/img/sunday_worship_service.jpeg",
      "midweek-prayer": "assets/img/prayer_meeting.jpg",
      "mothers-summit": "assets/img/mothers_prayer_meeting.jpg",
    };
    return map[id];
  }

  function defaultThumb(category) {
    const map = {
      worship:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80",
      prayer:
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=80",
      youth:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80",
      sacrament:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80",
      outreach:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
      training:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",
    };
    return map[category];
  }

  function escape(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
