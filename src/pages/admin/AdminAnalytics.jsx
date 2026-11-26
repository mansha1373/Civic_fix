import React, { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Download,
  Award
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"
import {
  MONTHLY_ANALYTICS_DATA,
  RESOLUTION_TIME_BY_CATEGORY
} from "../../data/mockData.js"
import { exportToCSV } from "../../utils/exportUtils.js"

const TIME_RANGES = ["Last 30 Days", "Last 90 Days", "This Year (2024)"]
const PIE_COLORS = ["#59343B", "#FFD20A", "#236336", "#C05621", "#8A5962", "#0284C7"]

export default function AdminAnalytics() {
  const { complaints, departments, stats } = useAdmin()
  const [selectedRange, setSelectedRange] = useState("This Year (2024)")

  // KPI calculations
  const totalComplaints = complaints.length
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length
  const resolutionRate = totalComplaints > 0 ? ((resolvedCount / totalComplaints) * 100).toFixed(1) : "0.0"
  const avgResolutionDays = "2.3"
  const citizenSatisfaction = "4.8 / 5.0"

  // Category counts
  const categoryCounts = {}
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1
  })

  const categoryChartData = Object.keys(categoryCounts).map((cat, idx) => ({
    name: cat,
    value: categoryCounts[cat],
    color: PIE_COLORS[idx % PIE_COLORS.length]
  }))

  // Department-wise performance data
  const departmentPerformance = departments.map((d) => {
    const deptComplaints = complaints.filter(
      (c) =>
        c.category?.toLowerCase() === d.name.toLowerCase() ||
        c.department?.toLowerCase() === d.name.toLowerCase()
    )
    const assigned = deptComplaints.length || d.assignedComplaints || 1
    const resolved =
      deptComplaints.filter((c) => c.status === "Resolved").length || d.resolvedComplaints || 0
    const pending =
      deptComplaints.filter((c) => c.status === "Pending").length || d.pendingComplaints || 0

    return {
      name: d.name.split(" ")[0],
      fullName: d.name,
      assigned,
      resolved,
      pending,
      rate: Math.round((resolved / assigned) * 100)
    }
  })

  const handleExportReport = () => {
    const exportData = departmentPerformance.map((dp) => ({
      Department: dp.fullName,
      AssignedComplaints: dp.assigned,
      ResolvedComplaints: dp.resolved,
      PendingComplaints: dp.pending,
      ResolutionRatePercent: `${dp.rate}%`
    }))
    exportToCSV(`CivicFix-Analytics-Report-2024`, exportData)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#281719] font-serif flex items-center gap-2">
            <span>Analytics & Intelligence Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#695154] mt-0.5">
            Real-time municipal performance benchmarks, citizen satisfaction, and SLA analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-[#EAE3D5] rounded-xl p-1 text-xs shadow-sm">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`py-1.5 px-3 rounded-lg font-bold transition ${
                  selectedRange === range
                    ? "bg-[#59343B] text-white shadow-sm"
                    : "text-[#59343B] hover:text-[#281719]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#59343B] hover:bg-[#43262C] text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resolution Rate */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
          <div className="flex items-center justify-between text-[#695154]">
            <span className="text-xs font-bold uppercase tracking-wider">Resolution Rate</span>
            <div className="w-10 h-10 rounded-xl bg-[#EBF5EE] text-[#1E5C31] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#281719] font-serif mt-3">
            {resolutionRate}%
          </h3>
          <p className="text-xs text-[#1E5C31] font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +4.3% vs target benchmark (75%)
          </p>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
          <div className="flex items-center justify-between text-[#695154]">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Resolution Time</span>
            <div className="w-10 h-10 rounded-xl bg-[#FFF4D0] text-[#7A5300] flex items-center justify-center">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#281719] font-serif mt-3">
            {avgResolutionDays} <span className="text-sm font-semibold text-[#695154]">Days</span>
          </h3>
          <p className="text-xs text-[#59343B] font-bold mt-2">
            Target SLA: &lt; 3.0 Days (Achieved)
          </p>
        </div>

        {/* Citizen Satisfaction */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
          <div className="flex items-center justify-between text-[#695154]">
            <span className="text-xs font-bold uppercase tracking-wider">Citizen CSAT Score</span>
            <div className="w-10 h-10 rounded-xl bg-[#FFF4D0] text-[#7A5300] flex items-center justify-center">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#281719] font-serif mt-3">
            {citizenSatisfaction}
          </h3>
          <p className="text-xs text-[#7A5300] font-bold mt-2">
            Based on 840+ citizen ratings
          </p>
        </div>

        {/* Active Backlog */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
          <div className="flex items-center justify-between text-[#695154]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Active Backlog</span>
            <div className="w-10 h-10 rounded-xl bg-[#F5ECEE] text-[#59343B] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#281719] font-serif mt-3">
            {stats.pending + stats.inProgress}{" "}
            <span className="text-sm font-semibold text-[#695154]">Tickets</span>
          </h3>
          <p className="text-xs text-[#695154] font-medium mt-2">
            {stats.pending} Pending • {stats.inProgress} In Execution
          </p>
        </div>
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-[#281719] font-serif">
                Total Complaints by Month
              </h4>
              <p className="text-xs text-[#695154]">
                Monthly grievances received vs successfully resolved
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#59343B] bg-[#FFF9EA] border border-[#EAE3D5] px-2.5 py-1 rounded-lg">
              Jan - Nov 2024
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#695154" }} axisLine={{ stroke: "#EAE3D5" }} />
                <YAxis tick={{ fontSize: 11, fill: "#695154" }} axisLine={{ stroke: "#EAE3D5" }} />
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
                <Bar dataKey="filed" name="Complaints Filed" fill="#59343B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#FFD20A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-[#281719] font-serif">
                Pending versus Resolved Trend
              </h4>
              <p className="text-xs text-[#695154]">
                Demonstrating clearance of backlogged tickets over time
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#695154" }} axisLine={{ stroke: "#EAE3D5" }} />
                <YAxis tick={{ fontSize: 11, fill: "#695154" }} axisLine={{ stroke: "#EAE3D5" }} />
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
                  name="Resolved Cases"
                  stroke="#236336"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#236336" }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  name="Active Pending Backlog"
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

      {/* Main Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-[#281719] font-serif">
                Most Reported Categories
              </h4>
              <p className="text-xs text-[#695154]">
                Grievance frequency breakdown across city departments
              </p>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} complaints`, name]}
                  contentStyle={{
                    backgroundColor: "#59343B",
                    borderRadius: "12px",
                    border: "none",
                    color: "#FFF9EA",
                    fontSize: "12px"
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span className="text-xs font-semibold text-[#281719]">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-[#281719] font-serif">
                Department-wise Performance
              </h4>
              <p className="text-xs text-[#695154]">
                Assigned volume vs resolved cases per civic wing
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D5" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10, fill: "#695154" }} axisLine={{ stroke: "#EAE3D5" }} />
                <YAxis tick={{ fontSize: 11, fill: "#695154" }} axisLine={{ stroke: "#EAE3D5" }} />
                <Tooltip
                  formatter={(val, name) => [`${val} complaints`, name]}
                  contentStyle={{
                    backgroundColor: "#59343B",
                    borderRadius: "12px",
                    border: "none",
                    color: "#FFF9EA",
                    fontSize: "12px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                <Bar dataKey="assigned" name="Assigned" fill="#59343B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#FFD20A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: SLA Compliance Benchmarks */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] shadow-civic">
        <h4 className="text-base font-bold text-[#281719] font-serif mb-1">
          Average Resolution Time by Category (SLA Compliance)
        </h4>
        <p className="text-xs text-[#695154] mb-4">
          Actual average days to complete repairs versus municipal statutory response targets
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {RESOLUTION_TIME_BY_CATEGORY.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5] flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-[#281719]">
                  {item.category}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#59343B] font-serif">
                    {item.avgDays}
                  </span>
                  <span className="text-xs text-[#695154] font-semibold">days</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#EAE3D5] text-[11px] flex items-center justify-between">
                <span className="text-[#695154]">Target: {item.targetDays}d</span>
                <span className="font-bold text-[#1E5C31]">Passed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
