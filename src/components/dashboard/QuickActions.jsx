import React from "react"
import { Link } from "react-router-dom"
import { Icon } from "./Icons.jsx"

export default function QuickActions() {
  const actions = [
    {
      title: "Report an Issue",
      desc: "Spot a pothole, garbage, or broken light? Report in 60s.",
      link: "/dashboard/report",
      icon: "plusCircle",
      highlight: true,
      badge: "Quick AI Triage"
    },
    {
      title: "Track My Reports",
      desc: "Check real-time officer updates, work orders & timelines.",
      link: "/dashboard/reports",
      icon: "myReports",
      highlight: false,
      badge: "Active updates"
    },
    {
      title: "Community Map",
      desc: "Inspect live sector progress across Chandigarh & Karnal.",
      link: "/dashboard/map",
      icon: "map",
      highlight: false,
      badge: "Live Sectors"
    }
  ]

  return (
    <div className="cf-quick-actions-container">
      <div className="cf-quick-actions-grid">
        {actions.map((act) => (
          <Link
            key={act.title}
            to={act.link}
            className={`cf-quick-action-card ${act.highlight ? "highlighted" : ""}`}
          >
            <div className="cf-quick-action-icon">
              <Icon name={act.icon} size={24} />
            </div>
            <div className="cf-quick-action-info">
              <div className="cf-quick-action-topline">
                <span className="cf-quick-action-title">{act.title}</span>
                {act.badge && <span className="cf-quick-action-badge">{act.badge}</span>}
              </div>
              <p className="cf-quick-action-desc">{act.desc}</p>
            </div>
            <div className="cf-quick-action-arrow">
              <Icon name="arrowUpRight" size={18} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
