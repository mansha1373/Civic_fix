import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"
import { areas } from "../data/areas.js"

export default function CommunityMap() {
  const [selectedArea, setSelectedArea] = useState(areas[0])
  const [metric, setMetric] = useState("Overall")

  const metrics = ["Overall", "Roads", "Waste", "Drainage", "Lights"]

  const getMetricScore = (area, m) => {
    if (m === "Overall") {
      return Math.round((area.roads + area.waste + area.drainage + area.lights) / 4)
    }
    return area[m.toLowerCase()] || 0
  }

  const getScoreColor = (score) => {
    if (score >= 75) return "#15803D"
    if (score >= 50) return "#B45309"
    return "#B91C1C"
  }

  return (
    <div className="cf-page-container">
      <div className="cf-page-header">
        <div>
          <span className="cf-pill">GEOGRAPHIC CIVIC INTELLIGENCE</span>
          <h1 className="cf-page-title">Community Map</h1>
          <p className="cf-page-subtitle">
            Explore live neighbourhood resolution rates, street progress, and active work orders across sectors.
          </p>
        </div>
        <Link to="/dashboard/report" className="cf-button">
          <Icon name="plusCircle" size={18} />
          <span>Report in My Sector</span>
        </Link>
      </div>

      {/* Metric Selector Bar */}
      <div className="cf-map-filter-bar">
        <span className="cf-map-filter-label">Filter Metric:</span>
        <div className="cf-map-metric-buttons">
          {metrics.map((m) => (
            <button
              type="button"
              key={m}
              className={`cf-map-metric-btn ${metric === m ? "active" : ""}`}
              onClick={() => setMetric(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Map Layout: Visual interactive map & sector panel */}
      <div className="cf-community-map-grid">
        {/* Interactive Map Visual */}
        <div className="cf-map-canvas-card">
          <div className="cf-map-canvas-header">
            <span className="cf-map-status-live">
              <span className="cf-pulse-dot" /> Live Citizen Feed: Chandigarh & Karnal
            </span>
            <span className="cf-map-tip">Click any sector to view breakdown</span>
          </div>

          <div className="cf-map-sectors-view">
            {areas.map((a) => {
              const score = getMetricScore(a, metric)
              const isSelected = selectedArea.id === a.id
              return (
                <div
                  key={a.id}
                  className={`cf-sector-node ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedArea(a)}
                  style={{
                    left: `${a.x}%`,
                    top: `${a.y}%`,
                    width: `${Math.max(a.w, 22)}%`,
                    height: `${Math.max(a.h, 24)}%`
                  }}
                >
                  <div className="cf-sector-node-top">
                    <span className="cf-node-name">{a.name}</span>
                    <span
                      className="cf-node-score"
                      style={{ color: getScoreColor(score) }}
                    >
                      {score}%
                    </span>
                  </div>
                  <div className="cf-node-sub">
                    <small>{a.fixed} Fixed</small>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="cf-map-legend-row">
            <div className="cf-legend-item">
              <span className="cf-legend-dot high" /> High Resolution (&ge; 75%)
            </div>
            <div className="cf-legend-item">
              <span className="cf-legend-dot mid" /> Active Progress (50-74%)
            </div>
            <div className="cf-legend-item">
              <span className="cf-legend-dot low" /> Needing Attention (&lt; 50%)
            </div>
          </div>
        </div>

        {/* Selected Area Details Card */}
        <div className="cf-sector-detail-card">
          <div className="cf-sector-detail-header">
            <span className="cf-category-tag">SECTOR SUMMARY</span>
            <h2 className="cf-sector-title">{selectedArea.name}</h2>
            <p className="cf-sector-subtitle">
              Civic performance index for this municipal ward.
            </p>
          </div>

          <div className="cf-sector-score-banner">
            <div className="score-big">
              {getMetricScore(selectedArea, metric)}%
            </div>
            <div className="score-label">
              <strong>{metric} Resolution Rate</strong>
              <span>Average turnaround: {selectedArea.days} days</span>
            </div>
          </div>

          <div className="cf-sector-bars">
            <div className="cf-meter-row">
              <span>Roads & Pavements</span>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${selectedArea.roads}%` }} />
              </div>
              <b>{selectedArea.roads}%</b>
            </div>
            <div className="cf-meter-row">
              <span>Waste & Sanitation</span>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${selectedArea.waste}%` }} />
              </div>
              <b>{selectedArea.waste}%</b>
            </div>
            <div className="cf-meter-row">
              <span>Drainage & Silt</span>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${selectedArea.drainage}%` }} />
              </div>
              <b>{selectedArea.drainage}%</b>
            </div>
            <div className="cf-meter-row">
              <span>Street Lighting</span>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${selectedArea.lights}%` }} />
              </div>
              <b>{selectedArea.lights}%</b>
            </div>
          </div>

          <div className="cf-sector-case-study">
            <div className="case-col before">
              <span className="case-tag">Recent Report</span>
              <p>{selectedArea.before}</p>
            </div>
            <div className="case-col after">
              <span className="case-tag fixed">Action Taken</span>
              <p>{selectedArea.after}</p>
            </div>
          </div>

          <div className="cf-sector-quote">
            <p>"{selectedArea.quote}"</p>
            <small>— Local {selectedArea.who}, {selectedArea.name}</small>
          </div>
        </div>
      </div>
    </div>
  )
}
