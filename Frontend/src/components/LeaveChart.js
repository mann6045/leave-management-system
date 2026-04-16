import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";
import API from "../services/api";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 13, fontWeight: 700, fontFamily: "Plus Jakarta Sans, sans-serif" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e0e7ff",
      borderRadius: 10,
      padding: "10px 16px",
      boxShadow: "0 4px 12px rgba(99,102,241,0.12)",
      fontFamily: "Plus Jakarta Sans, sans-serif",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
        {name}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#1e1b4b" }}>{value}</div>
    </div>
  );
};

const CustomLegend = ({ data }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 4, flexWrap: "wrap" }}>
    {data.map((entry, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: COLORS[i], flexShrink: 0
        }} />
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: "#6b7280", fontFamily: "Plus Jakarta Sans, sans-serif"
        }}>
          {entry.name}
          <span style={{ fontWeight: 800, color: "#1e1b4b", marginLeft: 5 }}>
            {entry.value}
          </span>
        </span>
      </div>
    ))}
  </div>
);

function LeaveChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/leaves/stats")
      .then(res => {
        const d = res.data;
        setData([
          { name: "Approved", value: d.approved || 0 },
          { name: "Pending",  value: d.pending  || 0 },
          { name: "Rejected", value: d.rejected || 0 },
        ]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const total   = data.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;

  return (
    <div style={{
      background: "#fff",
      padding: "24px 20px 20px",
      borderRadius: 16,
      boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
      border: "1px solid rgba(99,102,241,0.08)",
      width: "100%",
      maxWidth: 360,
      margin: "0 auto",
      fontFamily: "Plus Jakarta Sans, sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b" }}>
          Leave Distribution
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginTop: 2 }}>
          {total} total requests
        </div>
      </div>

      {loading ? (
        <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
          Loading…
        </div>
      ) : isEmpty ? (
        <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
          No leave data yet
        </div>
      ) : (
        <>
          {/* Donut chart with centre label */}
          <div style={{ position: "relative" }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  strokeWidth={0}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre total */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#1e1b4b", lineHeight: 1 }}>
                {total}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total
              </div>
            </div>
          </div>

          {/* Custom legend with counts */}
          <CustomLegend data={data} />
        </>
      )}
    </div>
  );
}

export default LeaveChart;