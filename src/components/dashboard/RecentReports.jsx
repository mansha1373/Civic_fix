import React from "react"
import { Link } from "react-router-dom"
import { Icon } from "./Icons.jsx"
import StatusBadge from "./StatusBadge.jsx"

export default function RecentReports({ reports = [], limit = 4 }) {
  const displayReports = reports.slice(0, limit)

  return (
    <div className="cf-recent-reports-section">
      <div className="cf-section-header">
        <div>
          <h2 className="cf-section-title">Recent Reports</h2>
          <p className="cf-section-subtitle">Track the latest civic complaints in your locality</p>
        </div>
        <Link to="/dashboard/reports" className="cf-view-all-link">
          <span>View All ({reports.length})</span>
          <Icon name="arrowRight" size={16} />
        </Link>
      </div>

      <div className="cf-reports-grid">
        {displayReports.map((report) => (
          <div key={report.id} className="cf-report-card">
            <div className="cf-report-card-media">
              <img
                src={report.image}
                alt={report.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                }}
              />
              <div className="cf-report-media-overlay">
                <span className="cf-category-tag">{report.category}</span>
                <StatusBadge status={report.status} />
              </div>
            </div>

            <div className="cf-report-card-content">
              <div className="cf-report-meta-row">
                <span className="cf-report-id">{report.id}</span>
                <span className="cf-report-date">
                  <Icon name="calendar" size={13} />
                  {report.date}
                </span>
              </div>

              <h3 className="cf-report-card-title">{report.title}</h3>

              <div className="cf-report-location">
                <Icon name="mapPin" size={15} />
                <span>{report.location}</span>
              </div>

              <div className="cf-report-footer">
                <div className="cf-report-upvotes">
                  <Icon name="thumbsUp" size={14} />
                  <span>{report.upvotes} Citizens Supported</span>
                </div>
                <Link to={`/dashboard/reports/${report.id}`} className="cf-report-details-btn">
                  <span>View Details</span>
                  <Icon name="arrowRight" size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
