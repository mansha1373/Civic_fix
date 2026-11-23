import React from "react"
import { Link, useOutletContext } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"
import StatCard from "../components/dashboard/StatCard.jsx"
import RecentReports from "../components/dashboard/RecentReports.jsx"
import QuickActions from "../components/dashboard/QuickActions.jsx"
import CommunityImpactPreview from "../components/dashboard/CommunityImpactPreview.jsx"
import { mockStatistics } from "../data/mockReports.js"

export default function Dashboard() {
  const { user, reports } = useOutletContext()

  // Calculate dynamic stats from current reports
  const totalCount = reports.length
  const underReviewCount = reports.filter(
    (r) => r.status === "Under Review" || r.status === "Submitted"
  ).length
  const inProgressCount = reports.filter((r) => r.status === "In Progress").length
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length

  const dynamicStats = mockStatistics.map((stat) => {
    if (stat.id === "total") return { ...stat, count: totalCount }
    if (stat.id === "review") return { ...stat, count: underReviewCount }
    if (stat.id === "progress") return { ...stat, count: inProgressCount }
    if (stat.id === "resolved") return { ...stat, count: resolvedCount }
    return stat
  })

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const firstName = (user?.name || "Citizen").split(" ")[0]

  return (
    <div className="cf-overview-page">
      {/* 4.A Welcome Section */}
      <section className="cf-welcome-section">
        <div className="cf-welcome-content">
          <div className="cf-welcome-pill">
            <span className="cf-pulse-dot" />
            <span>CITIZEN DASHBOARD · SECTOR 17, CHANDIGARH</span>
          </div>
          <h1 className="cf-welcome-title">
            {getGreeting()}, <span className="cf-welcome-name">{firstName}</span>!
          </h1>
          <p className="cf-welcome-subtitle">
            Your voice makes your neighbourhood better. Let's create cleaner, safer streets together.
          </p>
        </div>

        <div className="cf-welcome-actions">
          <Link to="/dashboard/report" className="cf-button cf-welcome-btn">
            <Icon name="plusCircle" size={18} />
            <span>Report an Issue</span>
          </Link>
        </div>
      </section>

      {/* 4.B Statistics Cards */}
      <section className="cf-stats-section">
        <div className="cf-stats-grid">
          {dynamicStats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      {/* 4.E Quick Actions */}
      <section className="cf-quick-actions-section">
        <QuickActions />
      </section>

      {/* 4.C Recent Reports */}
      <section className="cf-reports-section">
        <RecentReports reports={reports} limit={4} />
      </section>

      {/* 4.D Community Impact Preview */}
      <section className="cf-impact-section">
        <CommunityImpactPreview reports={reports} />
      </section>
    </div>
  )
}
