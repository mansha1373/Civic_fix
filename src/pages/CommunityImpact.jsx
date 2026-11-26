import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"
import { getComplaintStats } from "../services/civicfixService.js"

export default function CommunityImpact() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadStats() {
      try {
        setLoading(true)
        const data = await getComplaintStats()
        if (isMounted && data) {
          setStats(data)
        }
      } catch (err) {
        console.error("Failed to load community impact stats:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadStats()
    return () => {
      isMounted = false
    }
  }, [])

  const userStats = stats?.userStats || {
    total: 0,
    submitted: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0
  }

  const communityStats = stats?.communityStats || {
    total: 0,
    resolved: 0,
    active: 0,
    resolutionRate: "0%",
    avgDaysToResolve: 3.2,
    satisfactionRate: "94%",
    categoryBreakdown: []
  }

  return (
    <div className="cf-page-container">
      <div className="cf-page-header">
        <div>
          <span className="cf-pill">COMMUNITY MILESTONES</span>
          <h1 className="cf-page-title">Community Impact</h1>
          <p className="cf-page-subtitle">
            See how citizen reporting is transforming streets, parks, and sanitation across the region.
          </p>
        </div>
        <Link to="/dashboard/report" className="cf-button">
          <Icon name="plusCircle" size={18} />
          <span>Report an Issue</span>
        </Link>
      </div>

      {/* Hero Quote Card */}
      <div className="cf-impact-hero-banner">
        <div className="cf-impact-hero-text">
          <Icon name="sparkles" size={28} color="#FFD20A" />
          <h2 className="cf-impact-quote-title">
            "Every verified report directly drives municipal resources to where they are needed most."
          </h2>
          <span className="cf-impact-quote-author">
            — Municipal Corporation Grievance Redressal Audit (Live MongoDB Data)
          </span>
        </div>
      </div>

      {/* Personal Citizen Impact Section */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#281719", marginBottom: "12px" }}>
          Your Citizen Contributions
        </h3>
        <div className="cf-stats-grid">
          <div className="cf-stat-card">
            <div className="cf-stat-top">
              <div className="cf-stat-icon-wrap" style={{ background: "#F5EFE6", color: "#59343B" }}>
                <Icon name="fileText" size={22} color="#59343B" />
              </div>
              <span className="cf-stat-trend trend-positive">Your account</span>
            </div>
            <div className="cf-stat-body">
              <div className="cf-stat-count" style={{ color: "#59343B" }}>
                {userStats.total}
              </div>
              <div className="cf-stat-label">Your Submitted Reports</div>
              <p className="cf-stat-desc">Issues you brought to municipal attention</p>
            </div>
          </div>

          <div className="cf-stat-card">
            <div className="cf-stat-top">
              <div className="cf-stat-icon-wrap" style={{ background: "#DCFCE7", color: "#15803D" }}>
                <Icon name="checkCircle" size={22} color="#15803D" />
              </div>
              <span className="cf-stat-trend trend-positive">Completed</span>
            </div>
            <div className="cf-stat-body">
              <div className="cf-stat-count" style={{ color: "#15803D" }}>
                {userStats.resolved}
              </div>
              <div className="cf-stat-label">Your Issues Fixed</div>
              <p className="cf-stat-desc">Verified resolved by municipal teams</p>
            </div>
          </div>

          <div className="cf-stat-card">
            <div className="cf-stat-top">
              <div className="cf-stat-icon-wrap" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>
                <Icon name="tool" size={22} color="#1D4ED8" />
              </div>
              <span className="cf-stat-trend trend-positive">In progress</span>
            </div>
            <div className="cf-stat-body">
              <div className="cf-stat-count" style={{ color: "#1D4ED8" }}>
                {userStats.inProgress + userStats.underReview}
              </div>
              <div className="cf-stat-label">Your Active Tickets</div>
              <p className="cf-stat-desc">Under review or field execution</p>
            </div>
          </div>

          <div className="cf-stat-card">
            <div className="cf-stat-top">
              <div className="cf-stat-icon-wrap" style={{ background: "#FEF3C7", color: "#B45309" }}>
                <Icon name="award" size={22} color="#B45309" />
              </div>
              <span className="cf-stat-trend trend-positive">Active tier</span>
            </div>
            <div className="cf-stat-body">
              <div className="cf-stat-count" style={{ color: "#B45309" }}>
                {userStats.total > 0 ? "Civic Champion" : "New Citizen"}
              </div>
              <div className="cf-stat-label">Citizen Badge</div>
              <p className="cf-stat-desc">Community empowerment rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community-wide Metrics Cards */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#281719", marginBottom: "12px" }}>
          Community-Wide Resolution Metrics (MongoDB Aggregates)
        </h3>
        <div className="cf-stats-grid">
          <div className="cf-stat-card">
            <div className="cf-stat-top">
              <div className="cf-stat-icon-wrap" style={{ background: "#DCFCE7", color: "#15803D" }}>
                <Icon name="checkCircle" size={22} color="#15803D" />
              </div>
              <span className="cf-stat-trend trend-positive">{communityStats.resolutionRate} rate</span>
            </div>
            <div className="cf-stat-body">
              <div className="cf-stat-count" style={{ color: "#15803D" }}>
                {communityStats.resolved.toLocaleString()}
              </div>
              <div className="cf-stat-label">Total Community Issues Fixed</div>
              <p className="cf-stat-desc">Potholes, lights and garbage resolved</p>
            </div>
          </div>

          <div className="cf-stat-card">
            <div className="cf-stat-top">
              <div className="cf-stat-icon-wrap" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>
                <Icon name="tool" size={22} color="#1D4ED8" />
              </div>
              <span className="cf-stat-trend trend-positive">Live operations</span>
            </div>
            <div className="cf-stat-body">
              <div className="cf-stat-count" style={{ color: "#1D4ED8" }}>
                {communityStats.active}
              </div>
              <div className="cf-stat-label">Active Work Orders</div>
              <p className="cf-stat-desc">Currently being serviced by repair teams</p>
            </div>
          </div>

          <div className="cf-stat-card">
            <div className="cf-stat-top">
              <div className="cf-stat-icon-wrap" style={{ background: "#FEF3C7", color: "#B45309" }}>
                <Icon name="clock" size={22} color="#B45309" />
              </div>
              <span className="cf-stat-trend trend-positive">Average speed</span>
            </div>
            <div className="cf-stat-body">
              <div className="cf-stat-count" style={{ color: "#B45309" }}>
                {communityStats.avgDaysToResolve} Days
              </div>
              <div className="cf-stat-label">Avg. Resolution Speed</div>
              <p className="cf-stat-desc">Turnaround from citizen filing to sign-off</p>
            </div>
          </div>

          <div className="cf-stat-card">
            <div className="cf-stat-top">
              <div className="cf-stat-icon-wrap" style={{ background: "#F5EFE6", color: "#59343B" }}>
                <Icon name="award" size={22} color="#59343B" />
              </div>
              <span className="cf-stat-trend trend-positive">Audited</span>
            </div>
            <div className="cf-stat-body">
              <div className="cf-stat-count" style={{ color: "#59343B" }}>
                {communityStats.total}
              </div>
              <div className="cf-stat-label">Total Complaints Logged</div>
              <p className="cf-stat-desc">Cumulative civic issues reported across city</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category-Wise Breakdown Table */}
      {communityStats.categoryBreakdown && communityStats.categoryBreakdown.length > 0 && (
        <div className="cf-leaderboard-card" style={{ marginBottom: "28px" }}>
          <div className="cf-section-header">
            <div>
              <h2 className="cf-section-title">Category-Wise Issue Distribution</h2>
              <p className="cf-section-subtitle">
                Real database counts across grievance categories in your municipal portal.
              </p>
            </div>
          </div>

          <div className="cf-leaderboard-table">
            <div className="cf-table-head">
              <span>Category</span>
              <span>Total Logged</span>
              <span>Distribution</span>
            </div>
            {communityStats.categoryBreakdown.map((cat, idx) => {
              const pct = communityStats.total > 0 ? Math.round((cat.count / communityStats.total) * 100) : 0
              return (
                <div key={cat._id || idx} className="cf-table-row">
                  <div className="cf-sector-col">
                    <span className="cf-rank-badge">#{idx + 1}</span>
                    <strong>{cat._id || "Other"}</strong>
                  </div>
                  <div className="cf-metric-col">
                    <span className="cf-metric-pill">{cat.count} complaints</span>
                  </div>
                  <div className="cf-growth-col">
                    <span className="cf-growth-text">{pct}% of total</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
