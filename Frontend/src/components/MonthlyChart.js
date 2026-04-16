import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine
} from "recharts";
import API from "../services/api";

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e0e7ff",
      borderRadius: 12,
      padding: "10px 16px",
      boxShadow: "0 4px 16px rgba(99,102,241,0.14)",
      fontFamily: "Plus Jakarta Sans, sans-serif",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#9ca3af",
        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
        <span style={{ fontSize: 20, fontWeight: 800, color: "#1e1b4b" }}>
          {payload[0].value}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>leaves</span>
      </div>
    </div>
  );
};

/* ── Custom Dot ── */
const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.leaves === 0) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#6366f1" stroke="#fff" strokeWidth={2} />
    </g>
  );
};

const CustomActiveDot = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="rgba(99,102,241,0.15)" />
      <circle cx={cx} cy={cy} r={5} fill="#6366f1" stroke="#fff" strokeWidth={2} />
    </g>
  );
};

function MonthlyChart() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [peak, setPeak]       = useState(null);

  useEffect(() => {
    API.get("/leaves/monthly-stats")
      .then(res => {
        const formatted = Object.keys(res.data).map(key => ({
          month:  key,
          leaves: res.data[key] || 0,
        }));
        setData(formatted);

        // find peak month
        const max = formatted.reduce((a, b) => (b.leaves > a.leaves ? b : a), { leaves: -1 });
        if (max.leaves > 0) setPeak(max);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const total   = data.reduce((s, d) => s + d.leaves, 0);
  const average = data.length ? Math.round(total / data.length) : 0;
  const isEmpty = total === 0;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      padding: "28px 28px 20px",
      border: "1px solid rgba(99,102,241,0.08)",
      boxShadow: "0 2px 8px rgba(99,102,241,0.07)",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      width: "100%",
      maxWidth: 700,
      margin: "0 auto",
      boxSizing: "border-box",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", marginBottom: 3 }}>
            Monthly Leave Trends
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>
            Leave applications across the year
          </div>
        </div>

        {/* Mini stat pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{
            background: "#f0f4ff", borderRadius: 100,
            padding: "6px 14px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#4338ca" }}>{total}</span>
          </div>
          <div style={{
            background: "#f0fdf4", borderRadius: 100,
            padding: "6px 14px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Avg/mo</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#065f46" }}>{average}</span>
          </div>
          {peak && (
            <div style={{
              background: "#fef3c7", borderRadius: 100,
              padding: "6px 14px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Peak</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#b45309" }}>{peak.month}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Chart ── */}
      {loading ? (
        <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
          Loading…
        </div>
      ) : isEmpty ? (
        <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
          No leave data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="leavesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fontWeight: 600, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#c7d2fe", strokeWidth: 1.5, strokeDasharray: "4 3" }} />

            {/* Average reference line */}
            {average > 0 && (
              <ReferenceLine
                y={average}
                stroke="#c7d2fe"
                strokeDasharray="5 4"
                strokeWidth={1.5}
                label={{
                  value: `avg ${average}`,
                  position: "insideTopRight",
                  fill: "#a5b4fc",
                  fontSize: 11,
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  dy: -6,
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="leaves"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#leavesGradient)"
              dot={<CustomDot />}
              activeDot={<CustomActiveDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* ── Footer legend ── */}
      {!loading && !isEmpty && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginTop: 16, paddingTop: 16,
          borderTop: "1px solid #f3f4f6",
        }}>
          <div style={{
            width: 24, height: 3, borderRadius: 100,
            background: "linear-gradient(90deg, #4338ca, #6366f1)",
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>
            Monthly leave count
          </span>
          <div style={{
            marginLeft: "auto", width: 24, height: 2,
            borderTop: "2px dashed #c7d2fe",
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#a5b4fc" }}>
            Monthly average
          </span>
        </div>
      )}
    </div>
  );
}

export default MonthlyChart;