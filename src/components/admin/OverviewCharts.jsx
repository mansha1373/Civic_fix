import React from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

export default function OverviewCharts({ complaints = [], monthlyTrend = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Inflow vs Resolution Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-[#281719] font-serif">
              Monthly Grievance Trajectory
            </h4>
            <p className="text-xs text-[#695154]">
              Incoming citizen complaints vs verified field resolutions
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#59343B] bg-[#FFF9EA] border border-[#EAE3D5] px-2.5 py-1 rounded-lg">
            2024 Trends
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyTrend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D5" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#695154" }}
                axisLine={{ stroke: "#EAE3D5" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#695154" }}
                axisLine={{ stroke: "#EAE3D5" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#59343B",
                  borderRadius: "12px",
                  border: "none",
                  color: "#FFF9EA",
                  fontSize: "12px"
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar
                dataKey="filed"
                name="Complaints Filed"
                fill="#59343B"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="resolved"
                name="Resolved Cases"
                fill="#FFD20A"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Velocity Line Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-[#281719] font-serif">
              Backlog Clearance Velocity
            </h4>
            <p className="text-xs text-[#695154]">
              Active pending cases reducing in proportion to resolved work orders
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#1E5C31] bg-[#EBF5EE] border border-[#C3E4CD] px-2.5 py-1 rounded-lg">
            +18.4% Efficiency
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyTrend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D5" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#695154" }}
                axisLine={{ stroke: "#EAE3D5" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#695154" }}
                axisLine={{ stroke: "#EAE3D5" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#59343B",
                  borderRadius: "12px",
                  border: "none",
                  color: "#FFF9EA",
                  fontSize: "12px"
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line
                type="monotone"
                dataKey="resolved"
                name="Cumulative Resolved"
                stroke="#236336"
                strokeWidth={3}
                dot={{ r: 4, fill: "#236336" }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                name="Backlog Queue"
                stroke="#FFD20A"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: "#FFD20A" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
