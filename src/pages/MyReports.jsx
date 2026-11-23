import React, { useState } from "react"
import { Link, useOutletContext, useSearchParams } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"
import StatusBadge from "../components/dashboard/StatusBadge.jsx"
import { mockCategories } from "../data/mockReports.js"

export default function MyReports() {
  const { reports } = useOutletContext()
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  const [statusTab, setStatusTab] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [sortBy, setSortBy] = useState("newest")

  // Check if any filter is active
  const hasActiveFilters =
    statusTab !== "all" ||
    categoryFilter !== "all" ||
    searchTerm.trim() !== "" ||
    sortBy !== "newest"

  const clearAllFilters = () => {
    setStatusTab("all")
    setCategoryFilter("all")
    setSearchTerm("")
    setSortBy("newest")
  }

  // Filter reports
  const filteredReports = reports.filter((report) => {
    // Status filter
    const statusLower = (report.status || "").toLowerCase().trim()
    let matchesStatus = true
    if (statusTab === "submitted") {
      matchesStatus = statusLower === "submitted"
    } else if (statusTab === "review") {
      matchesStatus = statusLower === "under review"
    } else if (statusTab === "progress") {
      matchesStatus = statusLower === "in progress"
    } else if (statusTab === "resolved") {
      matchesStatus = statusLower === "resolved"
    } else if (statusTab === "rejected") {
      matchesStatus = statusLower === "rejected"
    }

    // Category filter
    let matchesCategory = true
    if (categoryFilter !== "all") {
      const repCat = (report.category || "").toLowerCase()
      const repKey = (report.categoryKey || "").toLowerCase()
      const filterLower = categoryFilter.toLowerCase()
      matchesCategory = repCat.includes(filterLower) || repKey.includes(filterLower)
    }

    // Search query
    const query = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !query ||
      (report.id && report.id.toLowerCase().includes(query)) ||
      (report.title && report.title.toLowerCase().includes(query)) ||
      (report.location && report.location.toLowerCase().includes(query))

    return matchesStatus && matchesCategory && matchesSearch
  })

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === "oldest") {
      return (a.id || "").localeCompare(b.id || "")
    }
    if (sortBy === "upvotes") {
      return (b.upvotes || 0) - (a.upvotes || 0)
    }
    if (sortBy === "urgency") {
      const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 }
      return (rank[b.urgency] || 0) - (rank[a.urgency] || 0)
    }
    // Default newest first
    return (b.id || "").localeCompare(a.id || "")
  })

  // Tab count calculations
  const countSubmitted = reports.filter(
    (r) => (r.status || "").toLowerCase() === "submitted"
  ).length
  const countReview = reports.filter(
    (r) => (r.status || "").toLowerCase() === "under review"
  ).length
  const countProgress = reports.filter(
    (r) => (r.status || "").toLowerCase() === "in progress"
  ).length
  const countResolved = reports.filter(
    (r) => (r.status || "").toLowerCase() === "resolved"
  ).length
  const countRejected = reports.filter(
    (r) => (r.status || "").toLowerCase() === "rejected"
  ).length

  return (
    <div className="cf-page-container">
      {/* 1. Header */}
      <div className="cf-page-header">
        <div>
          <span className="cf-pill">CITIZEN COMPLAINT TRACKER</span>
          <h1 className="cf-page-title">My Reports</h1>
          <p className="cf-page-subtitle">
            Track your reported civic issues and stay updated on the progress.
          </p>
        </div>
        <Link to="/dashboard/report" className="cf-button">
          <Icon name="plusCircle" size={18} />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* 2. Filter Tabs & Controls Toolbar */}
      <div className="cf-filters-toolbar">
        {/* Horizontal Status Filter Tabs */}
        <div className="cf-filter-tabs">
          <button
            type="button"
            className={`cf-filter-tab ${statusTab === "all" ? "active" : ""}`}
            onClick={() => setStatusTab("all")}
          >
            All Reports ({reports.length})
          </button>
          <button
            type="button"
            className={`cf-filter-tab ${statusTab === "submitted" ? "active" : ""}`}
            onClick={() => setStatusTab("submitted")}
          >
            Submitted ({countSubmitted})
          </button>
          <button
            type="button"
            className={`cf-filter-tab ${statusTab === "review" ? "active" : ""}`}
            onClick={() => setStatusTab("review")}
          >
            Under Review ({countReview})
          </button>
          <button
            type="button"
            className={`cf-filter-tab ${statusTab === "progress" ? "active" : ""}`}
            onClick={() => setStatusTab("progress")}
          >
            In Progress ({countProgress})
          </button>
          <button
            type="button"
            className={`cf-filter-tab ${statusTab === "resolved" ? "active" : ""}`}
            onClick={() => setStatusTab("resolved")}
          >
            Resolved ({countResolved})
          </button>
          <button
            type="button"
            className={`cf-filter-tab ${statusTab === "rejected" ? "active" : ""}`}
            onClick={() => setStatusTab("rejected")}
          >
            Rejected ({countRejected})
          </button>
        </div>

        {/* Detailed Controls: Search, Category, Sort & Clear */}
        <div className="cf-filter-controls">
          {/* Search by complaint ID or Title */}
          <div className="cf-search-box">
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Search by ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search reports by ID or title"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="cf-search-clear"
                aria-label="Clear search text"
              >
                <Icon name="close" size={13} />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="cf-category-dropdown">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="cf-select"
              aria-label="Filter by Category"
            >
              <option value="all">All Categories</option>
              {mockCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="cf-sort-dropdown">
            <span className="cf-sort-label">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cf-select"
              aria-label="Sort reports"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="urgency">Highest Urgency</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>

          {/* Clear Filters Option */}
          {hasActiveFilters && (
            <button
              type="button"
              className="cf-clear-filters-btn"
              onClick={clearAllFilters}
              title="Reset all active filters"
            >
              <Icon name="refresh" size={14} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Empty States & Reports Grid */}
      {reports.length === 0 ? (
        /* Empty State: User hasn't submitted any complaints */
        <div className="cf-empty-state-card">
          <div className="cf-empty-icon">
            <Icon name="fileText" size={44} color="#59343B" />
          </div>
          <h3 className="cf-empty-title">You haven't reported any issues yet.</h3>
          <p className="cf-empty-desc">
            Spot a pothole, uncollected garbage, or a broken streetlight in your sector?
            Report it in just 60 seconds and help improve our neighbourhood.
          </p>
          <Link to="/dashboard/report" className="cf-button" style={{ marginTop: "16px" }}>
            <Icon name="plusCircle" size={18} />
            <span>Report an Issue</span>
          </Link>
        </div>
      ) : sortedReports.length === 0 ? (
        /* Empty State: Filter yielded no results */
        <div className="cf-empty-state-card">
          <div className="cf-empty-icon">
            <Icon name="search" size={40} color="#59343B" />
          </div>
          <h3 className="cf-empty-title">No matching reports found</h3>
          <p className="cf-empty-desc">
            No complaints match your active filter criteria
            {searchTerm && ` ("${searchTerm}")`}
            {categoryFilter !== "all" && ` in ${categoryFilter}`}
            {statusTab !== "all" && ` with status "${statusTab}"`}.
          </p>
          <button
            type="button"
            className="cf-button"
            style={{ marginTop: "16px" }}
            onClick={clearAllFilters}
          >
            <Icon name="refresh" size={16} />
            <span>Clear All Filters</span>
          </button>
        </div>
      ) : (
        /* Reports Grid */
        <div className="cf-reports-grid">
          {sortedReports.map((report) => (
            <div key={report.id} className="cf-report-card">
              {/* Media & Badges */}
              <div className="cf-report-card-media">
                <img
                  src={report.image}
                  alt={report.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                  }}
                />
                <div className="cf-report-media-overlay">
                  <span className="cf-category-tag">{report.category}</span>
                  <StatusBadge status={report.status} />
                </div>
              </div>

              {/* Card Content */}
              <div className="cf-report-card-content">
                {/* Meta Row: ID & Upvotes */}
                <div className="cf-report-meta-row">
                  <span className="cf-report-id">{report.id}</span>
                  <span className="cf-report-upvotes">
                    <Icon name="thumbsUp" size={13} />
                    <span>{report.upvotes || 1} Citizens</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="cf-report-card-title">{report.title}</h3>

                {/* Location */}
                <div className="cf-report-location">
                  <Icon name="mapPin" size={15} />
                  <span>{report.location}</span>
                </div>

                {/* Dates: Submission Date & Last Updated Date */}
                <div className="cf-report-dates-row">
                  <div className="cf-report-date-item">
                    <span className="cf-date-lbl">Submitted:</span>
                    <span className="cf-date-val">
                      <Icon name="calendar" size={12} />
                      {report.submittedDate || report.date}
                    </span>
                  </div>
                  <div className="cf-report-date-item">
                    <span className="cf-date-lbl">Last Updated:</span>
                    <span className="cf-date-val">
                      <Icon name="clock" size={12} />
                      {report.lastUpdated || report.date}
                    </span>
                  </div>
                </div>

                {/* Card Footer with View Details */}
                <div className="cf-report-footer">
                  <span className="cf-report-dept-tag">
                    {report.department ? report.department.split(" ")[0] : "MCC"}
                  </span>
                  <Link
                    to={`/dashboard/reports/${report.id}`}
                    className="cf-report-details-btn"
                  >
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
