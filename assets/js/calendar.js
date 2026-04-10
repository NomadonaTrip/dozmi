/* ======================================================================
   Interactive month-view calendar (hero widget + events page).
   Mount by setting [data-calendar] on a container element.
   Optional attributes:
     data-calendar-size="compact" | "full"
     data-calendar-year / data-calendar-month (override start)
   ====================================================================== */

(function () {
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const DOW_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

  function mountCalendar(host) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const state = {
      year: parseInt(host.dataset.calendarYear || today.getFullYear(), 10),
      month: host.dataset.calendarMonth != null
        ? parseInt(host.dataset.calendarMonth, 10)
        : today.getMonth(),
      selected: fmtISO(today),
    };

    host.classList.add("calendar-card");
    host.innerHTML = `
      <div class="calendar-head">
        <div>
          <div class="eyebrow" style="font-size: 9px; letter-spacing: .28em;">Upcoming at DOZMI</div>
          <div class="calendar-title" data-role="title"></div>
        </div>
        <div class="flex items-center gap-2">
          <button class="calendar-nav-btn" data-role="prev" aria-label="Previous month">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button class="calendar-nav-btn" data-role="next" aria-label="Next month">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div class="cal-grid">
        <div class="cal-dow-row">
          ${DOW_LABELS.map((d) => `<div>${d}</div>`).join("")}
        </div>
        <div class="cal-days" data-role="days"></div>
      </div>
      <div class="calendar-event-pane" data-role="pane"></div>
    `;

    const title = host.querySelector('[data-role="title"]');
    const daysEl = host.querySelector('[data-role="days"]');
    const pane = host.querySelector('[data-role="pane"]');
    host.querySelector('[data-role="prev"]').addEventListener("click", () => {
      state.month--;
      if (state.month < 0) { state.month = 11; state.year--; }
      render();
    });
    host.querySelector('[data-role="next"]').addEventListener("click", () => {
      state.month++;
      if (state.month > 11) { state.month = 0; state.year++; }
      render();
    });

    function render() {
      title.textContent = `${MONTHS[state.month]} ${state.year}`;
      const eventsMap = window.expandEventsForMonth(state.year, state.month);
      daysEl.innerHTML = "";

      // Leading blank days (prev month)
      const firstDow = new Date(state.year, state.month, 1).getDay();
      const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
      const prevMonthDays = new Date(state.year, state.month, 0).getDate();
      for (let i = firstDow - 1; i >= 0; i--) {
        const cell = document.createElement("div");
        cell.className = "cal-day is-outside";
        cell.textContent = prevMonthDays - i;
        daysEl.appendChild(cell);
      }

      const todayIso = fmtISO(new Date());
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(state.year, state.month, d);
        const iso = fmtISO(dt);
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cal-day";
        cell.textContent = d;
        if (eventsMap[iso]) cell.classList.add("has-event");
        if (iso === todayIso) cell.classList.add("is-today");
        if (iso === state.selected) cell.classList.add("is-selected");
        cell.addEventListener("click", () => {
          state.selected = iso;
          render();
        });
        daysEl.appendChild(cell);
      }

      // Trailing blank days to fill the grid (6 rows max -> 42 cells)
      const totalCells = firstDow + daysInMonth;
      const trailing = (7 - (totalCells % 7)) % 7;
      for (let i = 1; i <= trailing; i++) {
        const cell = document.createElement("div");
        cell.className = "cal-day is-outside";
        cell.textContent = i;
        daysEl.appendChild(cell);
      }

      renderPane(eventsMap);
    }

    function renderPane(eventsMap) {
      const selectedEvents = eventsMap[state.selected] || [];
      const [y, m, d] = state.selected.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      const dayLabel = dt.toLocaleDateString("en-CA", {
        weekday: "long", month: "long", day: "numeric",
      });

      if (selectedEvents.length === 0) {
        pane.innerHTML = `
          <div class="cal-pane-label">${dayLabel}</div>
          <div class="cal-empty">No gatherings on this day. Browse another date or <a href="events.html" style="color: var(--primary); text-decoration: underline;">see the full calendar</a>.</div>
        `;
        return;
      }

      const monthAbbr = dt.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const items = selectedEvents
        .map(
          (ev) => `
          <div class="cal-event-item">
            <div class="cal-event-bullet">
              <span class="d">${d}</span>
              <span class="m">${monthAbbr}</span>
            </div>
            <div class="cal-event-meta" style="flex: 1;">
              <h4>${escapeHtml(ev.title)}</h4>
              <p>${escapeHtml(ev.time)} · ${escapeHtml(ev.location)}</p>
            </div>
          </div>
        `
        )
        .join("");

      pane.innerHTML = `
        <div class="cal-pane-label">${dayLabel}</div>
        ${items}
      `;
    }

    render();
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-calendar]").forEach(mountCalendar);
  });
})();
