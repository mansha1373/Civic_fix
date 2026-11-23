import React from "react"
import { Link } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"
import { mockCommunityImpact } from "../data/mockReports.js"

export default function CommunityImpact() {
  const { totalResolved, activeReports, avgDaysToResolve, satisfactionRate, communityQuote, topSectors } =
    mockCommunityImpact

  return (
    <div className="cf-page-container">
      <div className="cf-page-header">
        <div>
          <span className="cf-pill">COMMUNITY MILESTONES</span>
          <h1 className="cf-page-title">Community Impact</h1>
          <p className="cf-page-subtitle">
            See how citizen reporting is transforming streets, parks, and sanitation across the Tricity region.
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
          <h2 className="cf-impact-quote-title">"{communityQuote}"</h2>
          <span className="cf-impact-quote-author">
            — Municipal Action Progress Report (November 2024)
          </span>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="cf-stats-grid">
        <div className="cf-stat-card">
          <div className="cf-stat-top">
            <div className="cf-stat-icon-wrap" style={{ background: "#DCFCE7", color: "#15803D" }}>
              <Icon name="checkCircle" size={22} color="#15803D" />
            </div>
            <span className="cf-stat-trend trend-positive">+18% this month</span>
          </div>
          <div className="cf-stat-body">
            <div className="cf-stat-count" style={{ color: "#15803D" }}>
              {totalResolved.toLocaleString()}
            </div>
            <div className="cf-stat-label">Total Issues Fixed</div>
            <p className="cf-stat-desc">Roads, lights and garbage solved permanently</p>
          </div>
        </div>

        <div className="cf-stat-card">
          <div className="cf-stat-top">
            <div className="cf-stat-icon-wrap" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>
              <Icon name="tool" size={22} color="#1D4ED8" />
            </div>
            <span className="cf-stat-trend trend-positive">Crew active</span>
          </div>
          <div className="cf-stat-body">
            <div className="cf-stat-count" style={{ color: "#1D4ED8" }}>
              {activeReports}
            </div>
            <div className="cf-stat-label">Active Work Orders</div>
            <p className="cf-stat-desc">Currently being repaired by municipal teams</p>
          </div>
        </div>

        <div className="cf-stat-card">
          <div className="cf-stat-top">
            <div className="cf-stat-icon-wrap" style={{ background: "#FEF3C7", color: "#B45309" }}>
              <Icon name="clock" size={22} color="#B45309" />
            </div>
            <span className="cf-stat-trend trend-positive">-1.2 days</span>
          </div>
          <div className="cf-stat-body">
            <div className="cf-stat-count" style={{ color: "#B45309" }}>
              {avgDaysToResolve} Days
            </div>
            <div className="cf-stat-label">Avg. Resolution Speed</div>
            <p className="cf-stat-desc">Average turnaround from citizen post to fix</p>
          </div>
        </div>

        <div className="cf-stat-card">
          <div className="cf-stat-top">
            <div className="cf-stat-icon-wrap" style={{ background: "#F5EFE6", color: "#59343B" }}>
              <Icon name="award" size={22} color="#59343B" />
            </div>
            <span className="cf-stat-trend trend-positive">High Trust</span>
          </div>
          <div className="cf-stat-body">
            <div className="cf-stat-count" style={{ color: "#59343B" }}>
              {satisfactionRate}
            </div>
            <div className="cf-stat-label">Citizen Satisfaction</div>
            <p className="cf-stat-desc">Positive verification reviews from residents</p>
          </div>
        </div>
      </div>

      {/* Sector Leaderboard */}
      <div className="cf-leaderboard-card">
        <div className="cf-section-header">
          <div>
            <h2 className="cf-section-title">Ward & Sector Resolution Leaderboard</h2>
            <p className="cf-section-subtitle">
              Sectors with the fastest response times and highest community resolution rates.
            </p>
          </div>
          <Link to="/dashboard/map" className="cf-view-all-link">
            <span>View on Map</span>
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <div className="cf-leaderboard-table">
          <div className="cf-table-head">
            <span>Sector / City</span>
            <span>Issues Resolved</span>
            <span>Citizen Rating</span>
            <span>Monthly Growth</span>
          </div>
          {topSectors.map((sector, idx) => (
            <div key={sector.name} className="cf-table-row">
              <div className="cf-sector-col">
                <span className="cf-rank-badge">#{idx + 1}</span>
                <strong>{sector.name}</strong>
              </div>
              <div className="cf-metric-col">
                <span className="cf-metric-pill">{sector.resolved} fixed</span>
              </div>
              <div className="cf-rating-col">
                <span className="cf-star-tag">{sector.rating}</span>
              </div>
              <div className="cf-growth-col">
                <span className="cf-growth-text">{sector.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
