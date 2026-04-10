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
      title: "Midweek Prayer Meeting",
      cadence: "weekly",
      weekday: 3, // Wednesday
      time: "6:30 PM – 8:30 PM",
      location: "1560 Dundas St W, Mississauga",
      description:
        "Seeking God's face together. Intercession, prophetic declarations and breakthrough prayer.",
      category: "prayer",
    },
    {
      id: "prayer-storm",
      title: "Prayer Storm",
      cadence: "monthly",
      dayOfMonth: 1,
      time: "9:00 PM EST (Online)",
      location: "Online — link shared via newsletter",
      description:
        "Our monthly online prayer gathering held on the first day of every month. Join from anywhere for a fresh touch from God.",
      category: "prayer",
    },
    {
      id: "mothers-summit",
      title: "Mothers' Prayer Summit",
      cadence: "monthlyWeekday",
      nthWeek: 2, // 2nd
      weekday: 6, // Saturday
      time: "10:00 AM",
      location: "Hybrid — in person & online",
      description:
        "An inter-denominational gathering on the 2nd Saturday of every month where mothers stand in prayer for the next generation.",
      category: "prayer",
    },
  ],
  single: [
    {
      id: "night-of-worship",
      title: "A Night of Worship",
      date: "2026-04-17", // Friday
      time: "7:00 PM",
      location: "Main Sanctuary",
      description:
        "A dedicated evening of corporate worship, intimate prayer and ministry of the Spirit.",
      category: "worship",
      image:
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "revival-youth-night",
      title: "Revival Youth Night",
      date: "2026-04-24",
      time: "7:30 PM",
      location: "Community Hall",
      description:
        "Empowering the next generation. Music, message, prayer and pizza afterwards.",
      category: "youth",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "water-baptism",
      title: "Water Baptism Service",
      date: "2026-05-03",
      time: "After Sunday Service",
      location: "Main Sanctuary",
      description:
        "A public testament of faith. Let us know if you would like to be baptised — orientation the week prior.",
      category: "sacrament",
      image:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "outreach-homeless",
      title: "Homeless Outreach",
      date: "2026-04-25",
      time: "10:00 AM",
      location: "Downtown Toronto",
      description:
        "In partnership with Relentless Worship Ministries we reach out with care packages, hot meals and the gospel.",
      category: "outreach",
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "leadership-conference",
      title: "Leaders' Conference",
      date: "2026-05-16",
      time: "9:00 AM – 4:00 PM",
      location: "Main Sanctuary",
      description:
        "A day of equipping for small-group leaders, Kids Church workers and ministry volunteers.",
      category: "training",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "bible-school-orientation",
      title: "Bible School Orientation",
      date: "2026-05-10",
      time: "After Sunday Service",
      location: "Main Sanctuary",
      description:
        "Introduction to our new Bible School term — foundations, hermeneutics and practical ministry.",
      category: "training",
      image:
        "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80",
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
          addEvent(fmtISO(dt), rec);
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
