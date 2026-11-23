import React from "react"
import { Link } from "react-router-dom"
import { Icon } from "./Icons.jsx"
import { mockCommunityImpact } from "../../data/mockReports.js"

export default function CommunityImpactPreview({ reports = [] }) {
  const { avgDaysToResolve, communityQuote } = mockCommunityImpact

  const resolvedCount = reports.length > 0
    ? reports.filter((r) => (r.status || "").toLowerCase() === "resolved").length
    : mockCommunityImpact.totalResolved

  const activeCount = reports.length > 0
    ? reports.filter((r) => (r.status || "").toLowerCase() === "in progress").length
    : mockCommunityImpact.activeReports

  return (
    <div className="cf-community-impact-preview">
      <div className="cf-impact-preview-inner">
        <div className="cf-impact-preview-main">
          <div className="cf-impact-preview-pill">
            <Icon name="sparkles" size={14} />
            <span>Community Collective Power</span>
          </div>
          <h2 className="cf-impact-preview-title">Real Change in Our Neighbourhoods</h2>
          <p className="cf-impact-preview-quote">"{communityQuote}"</p>

          <div className="cf-impact-metrics-row">
            <div className="cf-impact-metric-item">
              <div className="cf-impact-metric-val">{resolvedCount}</div>
              <div className="cf-impact-metric-lbl">Resolved Issues</div>
            </div>
            <div className="cf-impact-metric-divider" />
            <div className="cf-impact-metric-item">
              <div className="cf-impact-metric-val">{activeCount}</div>
              <div className="cf-impact-metric-lbl">Active Works</div>
            </div>
            <div className="cf-impact-metric-divider" />
            <div className="cf-impact-metric-item">
              <div className="cf-impact-metric-val">{avgDaysToResolve} Days</div>
              <div className="cf-impact-metric-lbl">Avg. Turnaround</div>
            </div>
          </div>
        </div>

        <div className="cf-impact-preview-action">
          <div className="cf-impact-badge-box">
            <Icon name="award" size={32} color="#59343B" />
            <strong>Top Citizen City</strong>
            <small>Chandigarh Region</small>
          </div>
          <Link to="/dashboard/impact" className="cf-button cf-impact-btn">
            <span>Explore Community Impact</span>
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
