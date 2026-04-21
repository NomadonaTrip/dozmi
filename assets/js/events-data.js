/* ======================================================================
   DOZMI events data — used by the hero calendar widget and events page.
   `recurring` events expand each week/month; `single` events fire on an
   explicit date. Times are local (America/Toronto).
   ====================================================================== */

window.DOZMI_EVENTS = {
  recurring: [
    {
      id: "sunday-service",
      title: "Sunday Worship Service",
      cadence: "weekly",
      weekday: 0, // 0 = Sunday
      time: "6:30 PM – 8:30 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Our main gathering. Spirit-filled worship, the Word, ministry and community at the Erindale Presbyterian Church building.",
      category: "worship",
    },
    {
      id: "midweek-prayer",
      title: "Prayer and Encounter Meeting",
      cadence: "weekly",
      weekday: 3, // Wednesday
      time: "6:30 PM – 8:30 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come pray and encounter Jesus. Intercession, prophetic declarations and breakthrough prayer.",
      category: "prayer",
      // Dates when HolyGhost Night replaces Prayer & Encounter.
      exceptions: [
        "2026-05-27",
        "2026-08-26",
        "2026-10-28",
        "2026-12-30",
        "2027-02-24",
        "2027-04-28",
        "2027-06-30",
        "2027-08-25",
        "2027-10-27",
        "2027-12-29",
      ],
    },
  ],
  single: [
    {
      id: "holyghost-night-2026-05",
      title: "HolyGhost Night",
      date: "2026-05-27",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2026-08",
      title: "HolyGhost Night",
      date: "2026-08-26",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2026-10",
      title: "HolyGhost Night",
      date: "2026-10-28",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2026-12",
      title: "HolyGhost Night",
      date: "2026-12-30",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2027-02",
      title: "HolyGhost Night",
      date: "2027-02-24",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2027-04",
      title: "HolyGhost Night",
      date: "2027-04-28",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2027-06",
      title: "HolyGhost Night",
      date: "2027-06-30",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2027-08",
      title: "HolyGhost Night",
      date: "2027-08-25",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2027-10",
      title: "HolyGhost Night",
      date: "2027-10-27",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "holyghost-night-2027-12",
      title: "HolyGhost Night",
      date: "2027-12-29",
      time: "6:30 PM – 9:00 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Come experience the Holy Spirit's power and presence. Held in lieu of Prayer & Encounter this Wednesday.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "first-anniversary",
      title: "1st Year Anniversary Service",
      date: "2026-06-28",
      time: "6:30 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "One year of grace! Join us as we celebrate DOZMI's first anniversary with worship, testimony and thanksgiving.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "summer-picnic-june",
      title: "Summer Picnic",
      date: "2026-06-07",
      time: "After Sunday Service",
      location: "TBA — details via newsletter",
      description:
        "Food, fellowship and fresh air as we gather outside after service. All welcome.",
      category: "community",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "summer-picnic-july",
      title: "Summer Picnic",
      date: "2026-07-26",
      time: "After Sunday Service",
      location: "TBA — details via newsletter",
      description:
        "Second summer picnic of the season. Bring the family.",
      category: "community",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80",
    },
  ],
};

/* ----------------------------------------------------------------------
   Expand events into a date-keyed map for a given year/month.
   Returns: { "2026-04-12": [event, event...], ... }
   ---------------------------------------------------------------------- */
window.expandEventsForMonth = function (year, month /* 0-indexed */) {
  const map = {};
  const addEvent = (iso, ev) => {
    if (!map[iso]) map[iso] = [];
    map[iso].push(ev);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Recurring
  (window.DOZMI_EVENTS.recurring || []).forEach((rec) => {
    if (rec.cadence === "weekly") {
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month, d);
        if (dt.getDay() === rec.weekday) {
          const iso = fmtISO(dt);
          if (rec.exceptions && rec.exceptions.includes(iso)) continue;
          addEvent(iso, rec);
        }
      }
    } else if (rec.cadence === "monthly") {
      const dt = new Date(year, month, rec.dayOfMonth);
      if (dt.getMonth() === month) addEvent(fmtISO(dt), rec);
    } else if (rec.cadence === "monthlyWeekday") {
      // Find the Nth weekday in the month
      let count = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month, d);
        if (dt.getDay() === rec.weekday) {
          count++;
          if (count === rec.nthWeek) {
            addEvent(fmtISO(dt), rec);
            break;
          }
        }
      }
    }
  });

  // Single events
  (window.DOZMI_EVENTS.single || []).forEach((ev) => {
    const [y, m, d] = ev.date.split("-").map(Number);
    if (y === year && m - 1 === month) {
      addEvent(ev.date, ev);
    }
  });

  return map;
};

function fmtISO(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
window.fmtISO = fmtISO;

/* Get upcoming events from today — used on the home "Upcoming Gatherings" grid */
window.getUpcomingEvents = function (limit = 6) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out = [];
  // Scan next 120 days
  for (let offset = 0; offset < 120 && out.length < limit * 3; offset++) {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + offset);
    const map = window.expandEventsForMonth(dt.getFullYear(), dt.getMonth());
    const iso = fmtISO(dt);
    if (map[iso]) {
      map[iso].forEach((ev) => {
        out.push({ ...ev, occurrenceDate: iso });
      });
    }
  }
  return out.slice(0, limit);
};
