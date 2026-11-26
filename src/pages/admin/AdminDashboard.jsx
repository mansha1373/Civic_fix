import React, { useState } from "react"
import { useOutletContext } from "react-router-dom"
import {
  FileText,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  Download,
  Sparkles
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"
import AdminStatCard from "../../components/admin/AdminStatCard.jsx"
import OverviewCharts from "../../components/admin/OverviewCharts.jsx"
import RecentComplaintsTable from "../../components/admin/RecentComplaintsTable.jsx"
import UrgentAlerts from "../../components/admin/UrgentAlerts.jsx"
import DepartmentMiniMeter from "../../components/admin/DepartmentMiniMeter.jsx"
import ComplaintDetailModal from "../../components/admin/ComplaintDetailModal.jsx"
import { MONTHLY_ANALYTICS_DATA } from "../../data/mockData.js"
import { exportToCSV } from "../../utils/exportUtils.js"

export default function AdminDashboard() {
  const { complaints, departments, stats, currentUser } = useAdmin()
  const { openNewComplaint } = useOutletContext()
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const handleExportSummary = () => {
    const summaryData = complaints.map((c) => ({
      ID: c.id,
      Title: c.title,
      Category: c.category,
      Citizen: c.citizen?.name || "Citizen",
      CitizenPhone: c.citizen?.phone || "",
      Location: typeof c.location === "object" ? (c.location?.address || "") : (c.location || ""),
      Sector: typeof c.location === "object" ? (c.location?.sector || "") : (c.sector || ""),
      Priority: c.priority,
      Status: c.status,
      SubmissionDate: c.submissionDate,
      Department: c.department,
      Officer: c.assignedOfficer
    }))
    exportToCSV(`CivicFix-Complaints-Summary-${new Date().toISOString().split("T")[0]}`, summaryData)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header & Welcome Banner - Deep Burgundy (#59343B) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-7 rounded-3xl bg-[#59343B] text-white shadow-xl relative overflow-hidden border border-[#4A282E]">
        {/* Subtle decorative warm accents */}
        <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full bg-[#FFD20A]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-44 -bottom-10 w-44 h-44 rounded-full bg-[#FFF9EA]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EA]/15 border border-[#FFF9EA]/30 text-[#FFD20A] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Civic Governance Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
            Welcome back, {currentUser?.name?.split(" ")[0] || "Administrator"}!
          </h1>
          <p className="text-xs sm:text-sm text-[#EAE3D5] max-w-xl leading-relaxed">
            Live grievance tracking and departmental response overview for Chandigarh Municipal Corporation.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportSummary}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF9EA] text-xs font-bold border border-white/20 transition active:scale-95"
            title="Download CSV report of complaints"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openNewComplaint}
            className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] text-xs font-bold shadow-lg shadow-[#281719]/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log New Issue</span>
          </button>
        </div>
      </div>

      {/* 2. Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatCard
          title="Total Complaints"
          count={stats.total}
          change="+12.5%"
          isPositive={true}
          icon={FileText}
          variant="burgundy"
        />
        <AdminStatCard
          title="Pending Complaints"
          count={stats.pending}
          change="-4.2%"
          isPositive={true}
          icon={Clock}
          variant="yellow"
        />
        <AdminStatCard
          title="In Progress"
          count={stats.inProgress}
          change="+8.1%"
          isPositive={true}
          icon={Activity}
          variant="amber"
        />
        <AdminStatCard
          title="Resolved Complaints"
          count={stats.resolved}
          change="+18.4%"
          isPositive={true}
          icon={CheckCircle2}
          variant="emerald"
        />
        <AdminStatCard
          title="Rejected Complaints"
          count={stats.rejected}
          change="-2.1%"
          isPositive={false}
          icon={XCircle}
          variant="rose"
        />
      </div>

      {/* 3. Recharts Visualizations Grid */}
      <OverviewCharts complaints={complaints} monthlyTrend={MONTHLY_ANALYTICS_DATA} />

      {/* 4. Bottom Grid: Recent Activity, Urgent Alerts & Department Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentComplaintsTable
            complaints={complaints}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        </div>
        <div className="space-y-6">
          <UrgentAlerts
            complaints={complaints}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
          <DepartmentMiniMeter departments={departments} />
        </div>
      </div>

      {/* 5. Detail Modal for Complaint view/action */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  )
}
