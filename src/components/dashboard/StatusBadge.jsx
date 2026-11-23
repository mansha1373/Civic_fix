import React from "react"

/**
 * Reusable StatusBadge Component
 * Status Colors:
 * - Submitted: neutral/blue (#2563EB, bg #EFF6FF, border #BFDBFE)
 * - Under Review: amber (#B45309, bg #FEF3C7, border #FDE68A)
 * - In Progress: blue (#1D4ED8, bg #DBEAFE, border #BFDBFE)
 * - Resolved: green (#15803D, bg #DCFCE7, border #BBF7D0)
 * - Rejected: muted red (#B91C1C, bg #FEE2E2, border #FECACA)
 */
export default function StatusBadge({ status = "Under Review", className = "", showDot = true }) {
  const normalized = (status || "").toLowerCase().trim()

  let badgeClass = "status-review"
  let label = status || "Under Review"

  if (normalized === "resolved") {
    badgeClass = "status-resolved"
    label = "Resolved"
  } else if (normalized === "in progress") {
    badgeClass = "status-progress"
    label = "In Progress"
  } else if (normalized === "submitted") {
    badgeClass = "status-submitted"
    label = "Submitted"
  } else if (normalized === "rejected") {
    badgeClass = "status-rejected"
    label = "Rejected"
  } else if (normalized === "under review") {
    badgeClass = "status-review"
    label = "Under Review"
  }

  return (
    <span className={`cf-status-badge ${badgeClass} ${className}`}>
      {showDot && <span className="badge-dot" />}
      <span>{label}</span>
    </span>
  )
}
