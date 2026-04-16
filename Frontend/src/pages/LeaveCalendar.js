import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// ── Monday week start (fixes week/day navigation) ─────────────────────────
moment.updateLocale("en", {
  week: { dow: 1 }
});

const localizer = momentLocalizer(moment);

// ── Styles ────────────────────────────────────────────────────────────────
const CALENDAR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.lc-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
}
.lc-body {
  padding: 36px 40px;
  max-width: 1200px;
  margin: 0 auto;
}
.lc-page-header { margin-bottom: 24px; animation: lcFadeUp 0.4s ease both; }
.lc-page-title  { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 4px; }
.lc-page-sub    { font-size: 14px; color: #9ca3af; font-weight: 500; }

/* Legend */
.lc-legend { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; animation: lcFadeUp 0.42s ease both; }
.lc-legend-item {
  display: inline-flex; align-items: center; gap: 7px;
  background: #fff; border: 1px solid #e5e7eb;
  border-radius: 100px; padding: 5px 14px;
  font-size: 13px; font-weight: 600; color: #374151;
}
.lc-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

/* Card */
.lc-cal-card {
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid rgba(99,102,241,0.08);
  box-shadow: 0 2px 8px rgba(99,102,241,0.06), 0 16px 40px rgba(99,102,241,0.06);
  animation: lcFadeUp 0.45s ease both;
}

/* ── Event detail modal ── */
.lc-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(30,27,75,0.35);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  animation: lcFadeIn 0.2s ease;
}
.lc-modal {
  background: #fff;
  border-radius: 20px;
  padding: 32px 36px;
  width: 100%; max-width: 400px;
  box-shadow: 0 24px 80px rgba(30,27,75,0.25);
  border: 1px solid rgba(99,102,241,0.1);
  animation: lcModalPop 0.25s cubic-bezier(0.22,1,0.36,1);
}
.lc-modal-title {
  font-size: 18px; font-weight: 800; color: #1e1b4b;
  letter-spacing: -0.02em; margin-bottom: 20px;
  display: flex; align-items: center; gap: 10px;
}
.lc-modal-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
}
.lc-modal-row:last-of-type { border-bottom: none; }
.lc-modal-label { color: #9ca3af; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
.lc-modal-value { color: #1e1b4b; font-weight: 700; }
.lc-modal-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700;
  padding: 4px 12px; border-radius: 100px;
}
.lc-modal-badge.PENDING  { background: #fef3c7; color: #92400e; }
.lc-modal-badge.APPROVED { background: #d1fae5; color: #065f46; }
.lc-modal-badge.REJECTED { background: #fee2e2; color: #991b1b; }
.lc-modal-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.lc-modal-close {
  width: 100%; margin-top: 24px;
  padding: 12px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 14px rgba(99,102,241,0.3);
  transition: all 0.18s;
}
.lc-modal-close:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }

/* ════════════════════════════════
   react-big-calendar overrides
   ════════════════════════════════ */
.lc-cal-card .rbc-calendar,
.lc-cal-card .rbc-calendar * {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  box-sizing: border-box;
}

/* Toolbar */
.lc-cal-card .rbc-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
}
.lc-cal-card .rbc-toolbar-label {
  font-size: 18px !important; font-weight: 800 !important;
  color: #1e1b4b !important; letter-spacing: -0.02em !important; order: 2;
}
.lc-cal-card .rbc-btn-group { display: flex; gap: 4px; }
.lc-cal-card .rbc-btn-group:first-child { order: 1; }
.lc-cal-card .rbc-btn-group:last-child  { order: 3; }
.lc-cal-card .rbc-btn-group button {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 13px !important; font-weight: 600 !important;
  color: #6b7280 !important; background: #fff !important;
  border: 1.5px solid #e5e7eb !important; border-radius: 8px !important;
  padding: 7px 14px !important; cursor: pointer !important;
  transition: all 0.18s !important; line-height: 1.4 !important; margin: 0 !important;
}
.lc-cal-card .rbc-btn-group button:hover {
  background: #f0f4ff !important; color: #4338ca !important; border-color: #c7d2fe !important;
}
.lc-cal-card .rbc-btn-group button.rbc-active,
.lc-cal-card .rbc-btn-group button.rbc-active:hover,
.lc-cal-card .rbc-btn-group button.rbc-active:focus {
  background: linear-gradient(135deg, #4338ca, #6366f1) !important;
  color: #fff !important; border-color: #4338ca !important;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3) !important;
}

/* Month grid */
.lc-cal-card .rbc-month-view {
  border: 1px solid #f0f0f8 !important; border-radius: 12px !important; overflow: hidden;
}
.lc-cal-card .rbc-header {
  font-size: 11px !important; font-weight: 700 !important; color: #9ca3af !important;
  text-transform: uppercase !important; letter-spacing: 0.06em !important;
  padding: 10px 6px !important; background: #fafbff !important; border-bottom: 1px solid #f0f0f8 !important;
}
.lc-cal-card .rbc-header + .rbc-header { border-left: 1px solid #f0f0f8 !important; }
.lc-cal-card .rbc-month-row { border-top: 1px solid #f3f4f6 !important; }
.lc-cal-card .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f3f4f6 !important; }
.lc-cal-card .rbc-today { background: #f0f4ff !important; }
.lc-cal-card .rbc-off-range-bg { background: #fafafa !important; }
.lc-cal-card .rbc-off-range .rbc-button-link { color: #d1d5db !important; }
.lc-cal-card .rbc-date-cell {
  padding: 6px 8px !important; font-size: 13px !important; font-weight: 600 !important;
  color: #374151 !important; text-align: right;
}
.lc-cal-card .rbc-date-cell.rbc-now .rbc-button-link {
  background: #4338ca !important; color: #fff !important; border-radius: 50% !important;
  width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center;
}
.lc-cal-card .rbc-button-link {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 13px !important; font-weight: 600 !important;
}

/* Events */
.lc-cal-card .rbc-event {
  border-radius: 6px !important; font-size: 11px !important;
  font-weight: 700 !important; padding: 3px 7px !important;
  border: none !important; outline: none !important;
  cursor: pointer !important;
  transition: opacity 0.15s !important;
}
.lc-cal-card .rbc-event:hover { opacity: 0.88 !important; }
.lc-cal-card .rbc-event:focus { outline: none !important; }
.lc-cal-card .rbc-event-label { font-size: 11px !important; font-weight: 700 !important; }
.lc-cal-card .rbc-event-content { font-size: 11px !important; font-weight: 700 !important; }
.lc-cal-card .rbc-show-more {
  font-size: 11px !important; font-weight: 700 !important;
  color: #6366f1 !important; background: transparent !important; padding: 2px 6px !important;
}

/* Week / Day view */
.lc-cal-card .rbc-time-view {
  border: 1px solid #f0f0f8 !important; border-radius: 12px !important; overflow: hidden;
}
.lc-cal-card .rbc-time-header { border-bottom: 1px solid #f0f0f8 !important; }
.lc-cal-card .rbc-time-header-content { border-left: 1px solid #f0f0f8 !important; }
.lc-cal-card .rbc-time-gutter .rbc-label {
  font-size: 11px !important; font-weight: 600 !important; color: #9ca3af !important; padding: 0 8px !important;
}
.lc-cal-card .rbc-timeslot-group { border-bottom: 1px solid #f9fafb !important; min-height: 40px !important; }
.lc-cal-card .rbc-time-slot { border-top: none !important; }
.lc-cal-card .rbc-current-time-indicator { background: #6366f1 !important; height: 2px !important; }
.lc-cal-card .rbc-time-content { border-top: 1px solid #f0f0f8 !important; }
.lc-cal-card .rbc-time-content > * + * > * { border-left: 1px solid #f3f4f6 !important; }
.lc-cal-card .rbc-day-slot .rbc-time-slot { border-top: 1px solid #f9fafb !important; }
.lc-cal-card .rbc-time-header .rbc-header {
  font-size: 12px !important; font-weight: 700 !important; color: #6b7280 !important;
  padding: 10px 6px !important; border-bottom: none !important;
  text-transform: uppercase !important; letter-spacing: 0.05em !important; background: #fafbff !important;
}

/* Agenda view */
.lc-cal-card .rbc-agenda-view {
  border: 1px solid #f0f0f8 !important; border-radius: 12px !important; overflow: hidden;
}
.lc-cal-card .rbc-agenda-view table { width: 100% !important; border-collapse: collapse !important; }
.lc-cal-card .rbc-agenda-date-cell,
.lc-cal-card .rbc-agenda-time-cell,
.lc-cal-card .rbc-agenda-event-cell {
  padding: 12px 14px !important; font-size: 13px !important; font-weight: 500 !important;
  color: #374151 !important; border-bottom: 1px solid #f3f4f6 !important; vertical-align: middle !important;
}
.lc-cal-card .rbc-agenda-date-cell {
  font-weight: 700 !important; color: #1e1b4b !important; white-space: nowrap !important;
  background: #fafbff !important; width: 120px !important;
}
.lc-cal-card .rbc-agenda-time-cell { color: #6b7280 !important; white-space: nowrap !important; width: 100px !important; }
.lc-cal-card .rbc-agenda-empty {
  font-size: 14px !important; color: #9ca3af !important; text-align: center !important; padding: 40px !important;
}
.lc-cal-card table.rbc-agenda-table thead > tr > th {
  font-size: 11px !important; font-weight: 700 !important; text-transform: uppercase !important;
  letter-spacing: 0.07em !important; color: #9ca3af !important; padding: 10px 14px !important;
  background: #fafbff !important; border-bottom: 1px solid #f0f0f8 !important; text-align: left !important;
}

/* Popup */
.lc-cal-card .rbc-overlay {
  background: #fff !important; border: 1px solid #e5e7eb !important;
  border-radius: 12px !important; box-shadow: 0 8px 32px rgba(99,102,241,0.15) !important; padding: 12px !important;
}
.lc-cal-card .rbc-overlay-header {
  font-size: 13px !important; font-weight: 700 !important; color: #1e1b4b !important;
  padding-bottom: 8px !important; border-bottom: 1px solid #f3f4f6 !important; margin-bottom: 8px !important;
}

/* Selectable day highlight */
.lc-cal-card .rbc-slot-selecting { background: rgba(99,102,241,0.06) !important; }
.lc-cal-card .rbc-selected-cell  { background: rgba(99,102,241,0.08) !important; }

@keyframes lcFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lcFadeIn  { from { opacity: 0; } to { opacity: 1; } }
@keyframes lcModalPop {
  from { opacity: 0; transform: scale(0.94) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
`;

const LEGEND = [
  { label: "Approved", color: "#059669" },
  { label: "Pending",  color: "#f59e0b" },
  { label: "Rejected", color: "#dc2626" },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const STATUS_ICONS = { APPROVED: "✅", PENDING: "⏳", REJECTED: "❌" };

function LeaveCalendar() {
  const [events, setEvents]         = useState([]);
  const [view, setView]             = useState(Views.MONTH);
  const [date, setDate]             = useState(new Date());
  const [selectedEvent, setSelected] = useState(null); // for modal

  const fetchLeaves = useCallback(async () => {
    try {
      const res = await API.get("/leaves/my");
      const calendarEvents = res.data.map((leave) => ({
        id:        leave.id,
        title:     `${leave.leaveType} (${leave.status})`,
        start:     moment(leave.startDate, "YYYY-MM-DD").startOf("day").toDate(),
        end:       moment(leave.endDate,   "YYYY-MM-DD").endOf("day").toDate(),
        allDay:    true,
        status:    leave.status,
        leaveType: leave.leaveType,
        reason:    leave.reason,
        days:      leave.days,
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error("Calendar fetch error:", err);
    }
  }, []);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  // ── Event style: today border highlight + status colour ─────────────────
  const eventStyleGetter = (event) => {
    const colorMap = {
      APPROVED: "#059669",
      PENDING:  "#f59e0b",
      REJECTED: "#dc2626",
    };
    const color   = colorMap[event.status] || "#6366f1";
    const isToday = moment(event.start).isSame(moment(), "day");

    return {
      style: {
        backgroundColor: color,
        color:           "#fff",
        borderRadius:    "6px",
        padding:         "2px 7px",
        fontSize:        "11px",
        fontWeight:      700,
        border:          isToday ? "2px solid rgba(0,0,0,0.25)" : "none",
        boxShadow:       isToday ? "0 0 0 2px rgba(255,255,255,0.6)" : "none",
        cursor:          "pointer",
      },
    };
  };

  return (
    <>
      <style>{CALENDAR_CSS}</style>
      <div className="lc-root">
        <Navbar />
        <div className="lc-body">

          <div className="lc-page-header">
            <div className="lc-page-title">Leave Calendar</div>
            <div className="lc-page-sub">Click any event to view details · Week starts Monday</div>
          </div>

          {/* Legend */}
          <div className="lc-legend">
            {LEGEND.map((l) => (
              <div className="lc-legend-item" key={l.label}>
                <div className="lc-legend-dot" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="lc-cal-card">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"

              // ── Controlled state ──────────────────────────────────────
              view={view}
              date={date}
              onView={(newView) => setView(newView)}
              onNavigate={(newDate) => setDate(newDate)}

              // ── Range change (week/day switching fix) ─────────────────
              onRangeChange={(range) => {
                console.log("Range changed:", range);
              }}

              // ── Views config ──────────────────────────────────────────
              views={{
                month:  true,
                week:   true,
                day:    true,
                agenda: true,
              }}
              defaultView={Views.MONTH}

              // ── Click event → open modal ──────────────────────────────
              onSelectEvent={(event) => setSelected(event)}

              // ── Selectable slots ──────────────────────────────────────
              selectable

              popup
              style={{ height: 620 }}
              eventPropGetter={eventStyleGetter}
            />
          </div>

        </div>
      </div>

      {/* ── Event detail modal ── */}
      {selectedEvent && (
        <div className="lc-modal-overlay" onClick={() => setSelected(null)}>
          <div className="lc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lc-modal-title">
              {STATUS_ICONS[selectedEvent.status] || "📅"} Leave Details
            </div>

            <div className="lc-modal-row">
              <span className="lc-modal-label">Type</span>
              <span className="lc-modal-value">{selectedEvent.leaveType}</span>
            </div>
            <div className="lc-modal-row">
              <span className="lc-modal-label">Status</span>
              <span className={`lc-modal-badge ${selectedEvent.status}`}>
                <span className="lc-modal-dot" />
                {selectedEvent.status}
              </span>
            </div>
            <div className="lc-modal-row">
              <span className="lc-modal-label">From</span>
              <span className="lc-modal-value">
                {moment(selectedEvent.start).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="lc-modal-row">
              <span className="lc-modal-label">To</span>
              <span className="lc-modal-value">
                {moment(selectedEvent.end).format("DD MMM YYYY")}
              </span>
            </div>
            {selectedEvent.days && (
              <div className="lc-modal-row">
                <span className="lc-modal-label">Duration</span>
                <span className="lc-modal-value" style={{ color: "#6366f1" }}>
                  {selectedEvent.days} {selectedEvent.days === 1 ? "day" : "days"}
                </span>
              </div>
            )}
            {selectedEvent.reason && (
              <div className="lc-modal-row">
                <span className="lc-modal-label">Reason</span>
                <span className="lc-modal-value" style={{ maxWidth: 200, textAlign: "right" }}>
                  {selectedEvent.reason}
                </span>
              </div>
            )}

            <button className="lc-modal-close" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default LeaveCalendar;
