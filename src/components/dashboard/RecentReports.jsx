import React from "react"
import { Link } from "react-router-dom"
import { Icon } from "./Icons.jsx"
import StatusBadge from "./StatusBadge.jsx"

export default function RecentReports({ reports = [], limit = 4, loading = false }) {
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

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#695154" }}>
          <p>Loading your reports from MongoDB...</p>
        </div>
      ) : displayReports.length === 0 ? (
        <div className="cf-empty-state-box" style={{
          backgroundColor: "#FFFFFF",
          border: "1px dashed #EAE3D5",
          borderRadius: "1.25rem",
          padding: "48px 24px",
          textAlign: "center"
        }}>
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            backgroundColor: "#FFF9EA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: "#59343B"
          }}>
            <Icon name="fileText" size={26} color="#59343B" />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#281719", marginBottom: "6px" }}>
            No Complaints Filed Yet
          </h3>
          <p style={{ fontSize: "13px", color: "#695154", maxWidth: "380px", margin: "0 auto 20px" }}>
            You haven't submitted any civic issues yet. Spot a pothole, broken streetlight, or garbage pile? Report it now.
          </p>
          <Link to="/dashboard/report" className="cf-button" style={{ display: "inline-flex" }}>
            <Icon name="plusCircle" size={16} />
            <span>Submit Your First Report</span>
          </Link>
        </div>
      ) : (
        <div className="cf-reports-grid">
          {displayReports.map((report) => (
            <div key={report.id || report._id} className="cf-report-card">
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
                  <span className="cf-report-id">{report.id || report.complaintId}</span>
                  <span className="cf-report-date">
                    <Icon name="calendar" size={13} />
                    {report.date || report.submittedDate}
                  </span>
                </div>

                <h3 className="cf-report-card-title">{report.title}</h3>

                <div className="cf-report-location">
                  <Icon name="mapPin" size={15} />
                  <span>
                    {typeof report.location === "object"
                      ? (report.location?.address || report.location?.sector || "Sector 17, Chandigarh")
                      : (report.location || "Sector 17, Chandigarh")}
                  </span>
                </div>

                <div className="cf-report-footer">
                  <div className="cf-report-upvotes">
                    <Icon name="thumbsUp" size={14} />
                    <span>{report.upvotes || 1} Citizens Supported</span>
                  </div>
                  <Link to={`/dashboard/reports/${report.id || report.complaintId}`} className="cf-report-details-btn">
                    <span>View Details</span>
                    <Icon name="arrowRight" size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
