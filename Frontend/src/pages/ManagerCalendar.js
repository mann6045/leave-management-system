import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Monday week start
moment.updateLocale("en", { week: { dow: 1 } });
const localizer = momentLocalizer(moment);

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.mc-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.mc-body {
  padding: 36px 40px 64px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ── Page header ── */
.mc-page-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: 12px; margin-bottom: 28px;
  animation: mcFade 0.38s ease both;
}
.mc-page-title { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 3px; }
.mc-page-sub   { font-size: 14px; color: #9ca3af; font-weight: 500; }
.mc-page-date  {
  font-size: 13px; font-weight: 600; color: #6b7280;
  background: #fff; border: 1px solid #e8eaf6;
  padding: 6px 14px; border-radius: 100px;
}

/* ── Summary pills ── */
.mc-summary {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 24px;
  animation: mcFade 0.4s ease both;
}
.mc-sum-card {
  background: #fff; border-radius: 16px; padding: 18px 20px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  display: flex; align-items: center; gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.mc-sum-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.1); }
.mc-sum-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 19px; flex-shrink: 0;
}
.mc-sum-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
.mc-sum-value { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; line-height: 1; }

/* ── Main grid ── */
.mc-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  align-items: start;
}

/* ── Side panel ── */
.mc-side { display: flex; flex-direction: column; gap: 20px; }

/* Card */
.mc-card {
  background: #fff; border-radius: 18px; padding: 24px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  animation: mcFade 0.44s ease both;
}
.mc-card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
}
.mc-card-title { font-size: 14px; font-weight: 800; color: #1e1b4b; display: flex; align-items: center; gap: 7px; }
.mc-card-count {
  font-size: 11px; font-weight: 700; color: #6366f1;
  background: #ede9fe; padding: 2px 9px; border-radius: 100px;
}
.mc-card-count.red { color: #dc2626; background: #fee2e2; }

/* Today leave items */
.mc-leave-item {
  display: flex; align-items: flex-start; gap: 11px;
  padding: 12px 0; border-bottom: 1px solid #f3f4f6;
}
.mc-leave-item:last-child { border-bottom: none; padding-bottom: 0; }
.mc-leave-avatar {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, #4338ca, #818cf8);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0;
  letter-spacing: -0.02em;
}
.mc-leave-name { font-size: 13px; font-weight: 700; color: #1e1b4b; margin-bottom: 2px; }
.mc-leave-meta { font-size: 11px; color: #9ca3af; }
.mc-leave-badge {
  margin-left: auto; flex-shrink: 0;
  font-size: 10px; font-weight: 700; padding: 3px 8px;
  border-radius: 100px; letter-spacing: 0.04em; text-transform: uppercase;
}
.mc-leave-badge.SICK    { background: #fef3c7; color: #92400e; }
.mc-leave-badge.CASUAL  { background: #ede9fe; color: #6d28d9; }
.mc-leave-badge.PAID    { background: #d1fae5; color: #065f46; }
.mc-leave-badge.UNPAID  { background: #f3f4f6; color: #6b7280; }
.mc-leave-empty { text-align: center; color: #9ca3af; font-size: 13px; padding: 20px 0; font-weight: 600; }

/* Status filter */
.mc-filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 0; }
.mc-filter-pill {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 11px; font-weight: 700; padding: 4px 12px;
  border-radius: 100px; border: 1.5px solid #e5e7eb;
  background: #fff; color: #6b7280; cursor: pointer; transition: all 0.16s;
}
.mc-filter-pill.active { background: #eef2ff; border-color: #a5b4fc; color: #4338ca; }
.mc-filter-pill:hover:not(.active) { background: #f0f4ff; border-color: #c7d2fe; }

/* Legend */
.mc-legend { display: flex; flex-direction: column; gap: 8px; }
.mc-legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #6b7280; }
.mc-legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }

/* ── Calendar card ── */
.mc-cal-card {
  background: #fff; border-radius: 18px; padding: 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.05);
  animation: mcFade 0.45s ease both;
}

/* ── View switcher ── */
.mc-view-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px; flex-wrap: wrap; gap: 10px;
}
.mc-view-title { font-size: 15px; font-weight: 800; color: #1e1b4b; }
.mc-view-btns  { display: flex; gap: 4px; }
.mc-view-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700; padding: 7px 14px;
  border-radius: 8px; border: 1.5px solid #e5e7eb;
  background: #fff; color: #6b7280; cursor: pointer; transition: all 0.16s;
}
.mc-view-btn:hover  { background: #f0f4ff; color: #4338ca; border-color: #c7d2fe; }
.mc-view-btn.active {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff; border-color: #4338ca;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}

/* ════════════════════
   rbc overrides
   ════════════════════ */
.mc-cal-wrap .rbc-calendar,
.mc-cal-wrap .rbc-calendar * {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  box-sizing: border-box;
}
.mc-cal-wrap .rbc-toolbar { display: none !important; } /* we use our own */
.mc-cal-wrap .rbc-header {
  font-size: 11px !important; font-weight: 700 !important;
  color: #9ca3af !important; text-transform: uppercase !important;
  letter-spacing: 0.06em !important; padding: 10px 6px !important;
  background: #fafbff !important; border-bottom: 1px solid #f0f0f8 !important;
}
.mc-cal-wrap .rbc-header + .rbc-header { border-left: 1px solid #f0f0f8 !important; }
.mc-cal-wrap .rbc-month-view { border: 1px solid #f0f0f8 !important; border-radius: 12px !important; overflow: hidden; }
.mc-cal-wrap .rbc-month-row  { border-top: 1px solid #f3f4f6 !important; }
.mc-cal-wrap .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f3f4f6 !important; }
.mc-cal-wrap .rbc-today  { background: #f0f4ff !important; }
.mc-cal-wrap .rbc-off-range-bg { background: #fafafa !important; }
.mc-cal-wrap .rbc-off-range .rbc-button-link { color: #d1d5db !important; }
.mc-cal-wrap .rbc-date-cell {
  padding: 6px 8px !important; font-size: 12px !important;
  font-weight: 600 !important; color: #374151 !important; text-align: right;
}
.mc-cal-wrap .rbc-date-cell.rbc-now .rbc-button-link {
  background: #4338ca !important; color: #fff !important;
  border-radius: 50% !important; width: 24px; height: 24px;
  display: inline-flex; align-items: center; justify-content: center;
}
.mc-cal-wrap .rbc-button-link { font-family: 'Plus Jakarta Sans', sans-serif !important; font-size: 12px !important; font-weight: 600 !important; }
.mc-cal-wrap .rbc-event { border-radius: 5px !important; font-size: 11px !important; font-weight: 700 !important; padding: 2px 6px !important; border: none !important; outline: none !important; cursor: pointer !important; transition: opacity 0.15s !important; }
.mc-cal-wrap .rbc-event:hover { opacity: 0.85 !important; }
.mc-cal-wrap .rbc-show-more { font-size: 10px !important; font-weight: 700 !important; color: #6366f1 !important; background: transparent !important; }

/* Week / Day */
.mc-cal-wrap .rbc-time-view { border: 1px solid #f0f0f8 !important; border-radius: 12px !important; overflow: hidden; }
.mc-cal-wrap .rbc-time-header { border-bottom: 1px solid #f0f0f8 !important; }
.mc-cal-wrap .rbc-time-gutter .rbc-label { font-size: 11px !important; font-weight: 600 !important; color: #9ca3af !important; padding: 0 8px !important; }
.mc-cal-wrap .rbc-timeslot-group { border-bottom: 1px solid #f9fafb !important; min-height: 40px !important; }
.mc-cal-wrap .rbc-current-time-indicator { background: #6366f1 !important; height: 2px !important; }
.mc-cal-wrap .rbc-time-content > * + * > * { border-left: 1px solid #f3f4f6 !important; }

/* Agenda */
.mc-cal-wrap .rbc-agenda-view { border: 1px solid #f0f0f8 !important; border-radius: 12px !important; overflow: hidden; }
.mc-cal-wrap .rbc-agenda-date-cell,
.mc-cal-wrap .rbc-agenda-time-cell,
.mc-cal-wrap .rbc-agenda-event-cell {
  padding: 11px 14px !important; font-size: 13px !important;
  font-weight: 500 !important; color: #374151 !important;
  border-bottom: 1px solid #f3f4f6 !important; vertical-align: middle !important;
}
.mc-cal-wrap .rbc-agenda-date-cell {
  font-weight: 700 !important; color: #1e1b4b !important;
  background: #fafbff !important; width: 110px !important;
}
.mc-cal-wrap .rbc-agenda-empty {
  font-size: 14px !important; color: #9ca3af !important; text-align: center !important; padding: 36px !important;
}
.mc-cal-wrap table.rbc-agenda-table thead > tr > th {
  font-size: 11px !important; font-weight: 700 !important; text-transform: uppercase !important;
  letter-spacing: 0.07em !important; color: #9ca3af !important; padding: 10px 14px !important;
  background: #fafbff !important; border-bottom: 1px solid #f0f0f8 !important; text-align: left !important;
}
.mc-cal-wrap .rbc-overlay {
  background: #fff !important; border: 1px solid #e5e7eb !important;
  border-radius: 12px !important; box-shadow: 0 8px 32px rgba(99,102,241,0.15) !important; padding: 12px !important;
}

/* ── Event detail modal ── */
.mc-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(30,27,75,0.35); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; animation: mcFadeIn 0.2s ease;
}
.mc-modal {
  background: #fff; border-radius: 20px; padding: 32px 36px;
  width: 100%; max-width: 420px;
  box-shadow: 0 24px 80px rgba(30,27,75,0.25);
  border: 1px solid rgba(99,102,241,0.1);
  animation: mcModalPop 0.25s cubic-bezier(0.22,1,0.36,1);
}
.mc-modal-title { font-size: 18px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.02em; margin-bottom: 20px; }
.mc-modal-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
.mc-modal-row:last-of-type { border-bottom: none; }
.mc-modal-label { color: #9ca3af; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
.mc-modal-value { color: #1e1b4b; font-weight: 700; }
.mc-status-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 100px; }
.mc-status-badge.APPROVED { background: #d1fae5; color: #065f46; }
.mc-status-badge.PENDING  { background: #fef3c7; color: #92400e; }
.mc-status-badge.REJECTED { background: #fee2e2; color: #991b1b; }
.mc-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.mc-modal-close {
  width: 100%; margin-top: 22px; padding: 12px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #4338ca, #6366f1); color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 14px rgba(99,102,241,0.3); transition: all 0.18s;
}
.mc-modal-close:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }

@keyframes mcFade { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
@keyframes mcFadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes mcModalPop { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
`;

const STATUS_COLORS = {
  APPROVED: "#059669",
  PENDING:  "#f59e0b",
  REJECTED: "#dc2626",
};
const TYPE_COLORS = {
  SICK:   "#f59e0b",
  CASUAL: "#6366f1",
  PAID:   "#10b981",
  UNPAID: "#9ca3af",
};

const VIEW_LABELS = [
  { key: Views.MONTH,  label: "Month"  },
  { key: Views.WEEK,   label: "Week"   },
  { key: Views.DAY,    label: "Day"    },
  { key: Views.AGENDA, label: "Agenda" },
];

function ManagerCalendar() {
  const [leaves, setLeaves]         = useState([]);
  const [events, setEvents]         = useState([]);
  const [todayLeaves, setTodayLeaves] = useState([]);
  const [view, setView]             = useState(Views.MONTH);
  const [date, setDate]             = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchLeaves = useCallback(async () => {
    try {
      const res = await API.get("/manager/manager/all");
      const data = res.data;
      setLeaves(data);
      formatEvents(data);
      filterToday(data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const formatEvents = (data) => {
    const formatted = data
      .filter(l => l.status !== "REJECTED")
      .map(l => ({
        id:           l.id,
        title:        `${l.employeeName} — ${l.leaveType}`,
        start:        moment(l.startDate, "YYYY-MM-DD").startOf("day").toDate(),
        end:          moment(l.endDate,   "YYYY-MM-DD").endOf("day").toDate(),
        allDay:       true,
        status:       l.status,
        leaveType:    l.leaveType,
        employeeName: l.employeeName,
        employeeId:   l.employeeId,
        reason:       l.reason,
        days:         l.days,
      }));
    setEvents(formatted);
  };

  const filterToday = (data) => {
    const today = moment().startOf("day");
    setTodayLeaves(
      data.filter(l => {
        const start = moment(l.startDate, "YYYY-MM-DD");
        const end   = moment(l.endDate,   "YYYY-MM-DD");
        return start.isSameOrBefore(today, "day") && end.isSameOrAfter(today, "day") && l.status !== "REJECTED";
      })
    );
  };

  const filteredEvents = statusFilter === "ALL"
    ? events
    : events.filter(e => e.status === statusFilter);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: STATUS_COLORS[event.status] || "#6366f1",
      color: "#fff",
      borderRadius: "5px",
      padding: "2px 6px",
      fontSize: "11px",
      fontWeight: 700,
      border: "none",
      cursor: "pointer",
    }
  });

  const navigate = (action) => {
    const newDate = moment(date);
    if (action === "TODAY") { setDate(new Date()); return; }
    const unit = view === Views.MONTH ? "month" : view === Views.WEEK ? "week" : "day";
    if (action === "PREV") newDate.subtract(1, unit);
    else newDate.add(1, unit);
    setDate(newDate.toDate());
  };

  const getInitials = (name = "") => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // Summary stats
  const totalOnLeave    = todayLeaves.length;
  const totalPending    = leaves.filter(l => l.status === "PENDING").length;
  const totalApproved   = leaves.filter(l => l.status === "APPROVED").length;
  const totalThisMonth  = leaves.filter(l => moment(l.startDate, "YYYY-MM-DD").isSame(moment(), "month")).length;

  return (
    <>
      <style>{css}</style>
      <div className="mc-root">
        <Navbar />
        <div className="mc-body">

          {/* Header */}
          <div className="mc-page-header">
            <div>
              <div className="mc-page-title">Team Leave Calendar</div>
              <div className="mc-page-sub">Visual overview of your team's leave schedule</div>
            </div>
            <div className="mc-page-date">📅 {today}</div>
          </div>

          {/* Summary */}
          <div className="mc-summary">
            {[
              { label: "On Leave Today",  value: totalOnLeave,   icon: "🏖️", bg: "#fef3c7", color: "#b45309"  },
              { label: "Pending Review",  value: totalPending,   icon: "⏳", bg: "#fff7ed", color: "#c2410c"  },
              { label: "Approved",        value: totalApproved,  icon: "✅", bg: "#f0fdf4", color: "#065f46"  },
              { label: "This Month",      value: totalThisMonth, icon: "📋", bg: "#eff6ff", color: "#1d4ed8"  },
            ].map((s, i) => (
              <div className="mc-sum-card" key={i}>
                <div className="mc-sum-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div>
                  <div className="mc-sum-label">{s.label}</div>
                  <div className="mc-sum-value" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="mc-grid">

            {/* ── LEFT sidebar ── */}
            <div className="mc-side">

              {/* Today's leaves */}
              <div className="mc-card">
                <div className="mc-card-header">
                  <div className="mc-card-title">📍 On Leave Today</div>
                  <div className={`mc-card-count ${todayLeaves.length > 0 ? "red" : ""}`}>
                    {todayLeaves.length}
                  </div>
                </div>
                {todayLeaves.length === 0 ? (
                  <div className="mc-leave-empty">🎉 Everyone is in today!</div>
                ) : todayLeaves.map(l => (
                  <div key={l.id} className="mc-leave-item">
                    <div className="mc-leave-avatar">{getInitials(l.employeeName)}</div>
                    <div style={{ flex: 1 }}>
                      <div className="mc-leave-name">{l.employeeName}</div>
                      <div className="mc-leave-meta">
                        {moment(l.startDate, "YYYY-MM-DD").format("DD MMM")} → {moment(l.endDate, "YYYY-MM-DD").format("DD MMM")}
                      </div>
                    </div>
                    <div className={`mc-leave-badge ${l.leaveType}`}>{l.leaveType}</div>
                  </div>
                ))}
              </div>

              {/* Status filter */}
              <div className="mc-card">
                <div className="mc-card-header">
                  <div className="mc-card-title">🔽 Filter Events</div>
                </div>
                <div className="mc-filter-row">
                  {["ALL", "APPROVED", "PENDING"].map(s => (
                    <button
                      key={s}
                      className={`mc-filter-pill ${statusFilter === s ? "active" : ""}`}
                      onClick={() => setStatusFilter(s)}
                    >
                      {s === "ALL" ? `All (${events.length})` : s === "APPROVED" ? `✅ Approved` : `⏳ Pending`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mc-card">
                <div className="mc-card-header">
                  <div className="mc-card-title">🎨 Legend</div>
                </div>
                <div className="mc-legend">
                  {[
                    { label: "Approved",      color: STATUS_COLORS.APPROVED },
                    { label: "Pending",       color: STATUS_COLORS.PENDING  },
                  ].map(l => (
                    <div key={l.label} className="mc-legend-item">
                      <div className="mc-legend-dot" style={{ background: l.color }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT: Calendar ── */}
            <div className="mc-cal-card">
              {/* Custom toolbar */}
              <div className="mc-view-row">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button className="mc-view-btn" onClick={() => navigate("PREV")}>‹</button>
                  <button className="mc-view-btn" onClick={() => navigate("TODAY")}>Today</button>
                  <button className="mc-view-btn" onClick={() => navigate("NEXT")}>›</button>
                  <div className="mc-view-title" style={{ marginLeft: 4 }}>
                    {moment(date).format(view === Views.MONTH ? "MMMM YYYY" : view === Views.WEEK ? "[Week of] MMM D, YYYY" : "dddd, MMM D YYYY")}
                  </div>
                </div>
                <div className="mc-view-btns">
                  {VIEW_LABELS.map(v => (
                    <button
                      key={v.key}
                      className={`mc-view-btn ${view === v.key ? "active" : ""}`}
                      onClick={() => setView(v.key)}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mc-cal-wrap">
                <Calendar
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  view={view}
                  date={date}
                  onView={setView}
                  onNavigate={setDate}
                  onRangeChange={(range) => console.log("range:", range)}
                  views={{ month: true, week: true, day: true, agenda: true }}
                  popup
                  selectable
                  style={{ height: 580 }}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={(event) => setSelectedEvent(event)}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <div className="mc-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <div className="mc-modal-title">📋 Leave Details</div>

            <div className="mc-modal-row">
              <span className="mc-modal-label">Employee</span>
              <span className="mc-modal-value">{selectedEvent.employeeName}</span>
            </div>
            <div className="mc-modal-row">
              <span className="mc-modal-label">Leave Type</span>
              <span className="mc-modal-value">{selectedEvent.leaveType}</span>
            </div>
            <div className="mc-modal-row">
              <span className="mc-modal-label">Status</span>
              <span className={`mc-status-badge ${selectedEvent.status}`}>
                <span className="mc-status-dot" />
                {selectedEvent.status}
              </span>
            </div>
            <div className="mc-modal-row">
              <span className="mc-modal-label">From</span>
              <span className="mc-modal-value">{moment(selectedEvent.start).format("DD MMM YYYY")}</span>
            </div>
            <div className="mc-modal-row">
              <span className="mc-modal-label">To</span>
              <span className="mc-modal-value">{moment(selectedEvent.end).format("DD MMM YYYY")}</span>
            </div>
            {selectedEvent.days && (
              <div className="mc-modal-row">
                <span className="mc-modal-label">Duration</span>
                <span className="mc-modal-value" style={{ color: "#6366f1" }}>
                  {selectedEvent.days} {selectedEvent.days === 1 ? "day" : "days"}
                </span>
              </div>
            )}
            {selectedEvent.reason && (
              <div className="mc-modal-row">
                <span className="mc-modal-label">Reason</span>
                <span className="mc-modal-value" style={{ maxWidth: 200, textAlign: "right" }}>{selectedEvent.reason}</span>
              </div>
            )}

            <button className="mc-modal-close" onClick={() => setSelectedEvent(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ManagerCalendar;