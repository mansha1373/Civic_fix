import React from "react"
import { Link, useOutletContext } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"
import StatCard from "../components/dashboard/StatCard.jsx"
import RecentReports from "../components/dashboard/RecentReports.jsx"
import QuickActions from "../components/dashboard/QuickActions.jsx"
import CommunityImpactPreview from "../components/dashboard/CommunityImpactPreview.jsx"

export default function Dashboard() {
  const { user, reports = [], loadingReports } = useOutletContext()

  // Calculate dynamic stats from actual authenticated citizen reports in MongoDB
  const totalCount = reports.length
  const underReviewCount = reports.filter(
    (r) => r.status === "Under Review" || r.status === "Submitted"
  ).length
  const inProgressCount = reports.filter((r) => r.status === "In Progress").length
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length

  const dynamicStats = [
    {
      id: "total",
      label: "Total Reports Filed",
      count: totalCount,
      description: "All civic issues submitted by your account",
      trend: totalCount > 0 ? "Active reporter" : "No reports yet",
      trendUp: totalCount > 0,
      color: "#59343B",
      bgLight: "#F5EFE6",
      icon: "fileText"
    },
    {
      id: "review",
      label: "Under Verification",
      count: underReviewCount,
      description: "Submitted or being verified by ward officers",
      trend: underReviewCount > 0 ? `${underReviewCount} pending` : "All caught up",
      trendUp: false,
      color: "#B45309",
      bgLight: "#FEF3C7",
      icon: "clock"
    },
    {
      id: "progress",
      label: "Work in Progress",
      count: inProgressCount,
      description: "Municipal repair crews deployed on-site",
      trend: inProgressCount > 0 ? "Crew on field" : "None active",
      trendUp: inProgressCount > 0,
      color: "#1D4ED8",
      bgLight: "#DBEAFE",
      icon: "tool"
    },
    {
      id: "resolved",
      label: "Successfully Resolved",
      count: resolvedCount,
      description: "Verified fixes with citizen sign-off",
      trend: resolvedCount > 0 ? "Verified fixed" : "Awaiting first fix",
      trendUp: true,
      color: "#15803D",
      bgLight: "#DCFCE7",
      icon: "checkCircle"
    }
  ]

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
      {/* Welcome Section */}
      <section className="cf-welcome-section">
        <div className="cf-welcome-content">
          <div className="cf-welcome-pill">
            <span className="cf-pulse-dot" />
            <span>CITIZEN DASHBOARD · {user?.sector || "SECTOR 17"}, {user?.city?.toUpperCase() || "CHANDIGARH"}</span>
          </div>
          <h1 className="cf-welcome-title">
            {getGreeting()}, <span className="cf-welcome-name">{firstName}</span>!
          </h1>
          <p className="cf-welcome-subtitle">
            Your voice makes your neighbourhood better. Track your complaints and join hands for cleaner, safer streets.
          </p>
        </div>

        <div className="cf-welcome-actions">
          <Link to="/dashboard/report" className="cf-button cf-welcome-btn">
            <Icon name="plusCircle" size={18} />
            <span>Report an Issue</span>
          </Link>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="cf-stats-section">
        <div className="cf-stats-grid">
          {dynamicStats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="cf-quick-actions-section">
        <QuickActions />
      </section>

      {/* Recent Reports */}
      <section className="cf-reports-section">
        <RecentReports reports={reports} limit={4} loading={loadingReports} />
      </section>

      {/* Community Impact Preview */}
      <section className="cf-impact-section">
        <CommunityImpactPreview reports={reports} />
      </section>
    </div>
  )
}
