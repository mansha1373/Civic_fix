import React from "react"
import { Icon } from "./Icons.jsx"

export default function StatCard({ label, count, description, trend, trendUp, color, bgLight, icon }) {
  return (
    <div className="cf-stat-card">
      <div className="cf-stat-top">
        <div className="cf-stat-icon-wrap" style={{ backgroundColor: bgLight, color: color }}>
          <Icon name={icon} size={22} color={color} />
        </div>
        {trend && (
          <span className={`cf-stat-trend ${trendUp ? "trend-positive" : "trend-neutral"}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="cf-stat-body">
        <div className="cf-stat-count" style={{ color: color }}>
          {count}
        </div>
        <div className="cf-stat-label">{label}</div>
        <p className="cf-stat-desc">{description}</p>
      </div>
    </div>
  )
}
