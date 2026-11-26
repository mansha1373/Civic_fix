import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import L from "leaflet"
import { Icon } from "../components/dashboard/Icons.jsx"
import StatusBadge from "../components/dashboard/StatusBadge.jsx"
import { areas } from "../data/areas.js"
import { getCommunityReports } from "../services/civicfixService.js"

// Custom SVG Pin Icon for Community Map
const createCivicPinIcon = (status = "Submitted") => {
  let pinColor = "#59343B"
  let bubbleColor = "#FFD20A"

  const s = status.toLowerCase()
  if (s === "resolved") {
    pinColor = "#15803D"
    bubbleColor = "#DCFCE7"
  } else if (s === "in progress") {
    pinColor = "#1D4ED8"
    bubbleColor = "#DBEAFE"
  } else if (s === "under review") {
    pinColor = "#B45309"
    bubbleColor = "#FEF3C7"
  }

  return L.divIcon({
    className: "cf-leaflet-custom-marker",
    html: `
      <div class="cf-leaflet-pin-wrapper">
        <div class="cf-leaflet-pin-bubble" style="background-color: ${bubbleColor}; border-color: ${pinColor}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${pinColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="${bubbleColor}" />
            <circle cx="12" cy="10" r="3" fill="${pinColor}" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38]
  })
}

export default function CommunityMap() {
  const [selectedArea, setSelectedArea] = useState(areas[0])
  const [metric, setMetric] = useState("Overall")
  const [viewMode, setViewMode] = useState("geo") // "geo" (Live Leaflet Pins) or "sector" (Ward Breakdown)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const mapContainerRef = useRef(null)
  const mapInstance = useRef(null)

  const metrics = ["Overall", "Roads", "Waste", "Drainage", "Lights"]

  // Fetch community complaints from MongoDB
  useEffect(() => {
    let isMounted = true
    async function loadReports() {
      try {
        setLoading(true)
        const data = await getCommunityReports()
        if (isMounted) {
          setReports(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error("Failed to load community map reports:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadReports()
    return () => {
      isMounted = false
    }
  }, [])

  // Filter complaints that have genuine GPS coordinates
  const validGeoReports = reports.filter(
    (r) =>
      r.coordinates &&
      typeof r.coordinates.lat === "number" &&
      typeof r.coordinates.lng === "number" &&
      !isNaN(r.coordinates.lat) &&
      !isNaN(r.coordinates.lng)
  )

  const missingGeoCount = reports.length - validGeoReports.length

  // Mount Leaflet map when in "geo" view mode
  useEffect(() => {
    if (viewMode !== "geo" || !mapContainerRef.current) return

    // Clean up existing map instance
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }

    try {
      const defaultCenter =
        validGeoReports.length > 0
          ? [validGeoReports[0].coordinates.lat, validGeoReports[0].coordinates.lng]
          : [30.7415, 76.7794]

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      // Add pins for genuine complaint locations
      validGeoReports.forEach((report) => {
        const marker = L.marker([report.coordinates.lat, report.coordinates.lng], {
          icon: createCivicPinIcon(report.status)
        }).addTo(map)

        const popupContent = document.createElement("div")
        popupContent.style.fontFamily = "'Inter', sans-serif"
        popupContent.style.padding = "6px"
        popupContent.style.maxWidth = "220px"
        popupContent.innerHTML = `
          <strong style="color: #59343B; font-size: 12px; display: block;">${report.id || report.complaintId}</strong>
          <h4 style="font-size: 13px; font-weight: 700; color: #281719; margin: 4px 0;">${report.title}</h4>
          <span style="display: inline-block; font-size: 10px; font-weight: 700; background: #FFF9EA; color: #59343B; padding: 2px 6px; border-radius: 6px; margin-bottom: 4px;">${report.category}</span>
          <div style="font-size: 11px; color: #695154; margin-bottom: 6px;">📍 ${report.location}</div>
          <div style="font-size: 11px; font-weight: 600; color: #281719; margin-bottom: 8px;">Status: ${report.status}</div>
          <a href="/dashboard/reports/${report.id || report.complaintId}" style="display: inline-block; font-size: 11px; font-weight: 700; color: #59343B; text-decoration: underline;">View Complaint Details →</a>
        `
        marker.bindPopup(popupContent)
      })

      mapInstance.current = map

      setTimeout(() => {
        map.invalidateSize()
      }, 250)
    } catch (mapErr) {
      console.warn("Leaflet map initialization warning:", mapErr)
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [viewMode, validGeoReports])

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
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="cf-role-switcher" style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr", padding: "2px", width: "auto" }}>
            <button
              type="button"
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${viewMode === "geo" ? "bg-[#59343B] text-white" : "text-[#59343B]"}`}
              onClick={() => setViewMode("geo")}
            >
              Live Geo-Pins ({validGeoReports.length})
            </button>
            <button
              type="button"
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${viewMode === "sector" ? "bg-[#59343B] text-white" : "text-[#59343B]"}`}
              onClick={() => setViewMode("sector")}
            >
              Sector Heatmap
            </button>
          </div>
          <Link to="/dashboard/report" className="cf-button">
            <Icon name="plusCircle" size={18} />
            <span>Report in My Sector</span>
          </Link>
        </div>
      </div>

      {viewMode === "geo" ? (
        /* Live Leaflet Geo-Pins View */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE3D5",
            borderRadius: "1.25rem",
            overflow: "hidden",
            boxShadow: "0 4px 20px -2px rgba(40, 23, 25, 0.05)"
          }}>
            <div style={{
              padding: "16px 20px",
              backgroundColor: "#FFF9EA",
              borderBottom: "1px solid #EAE3D5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "#281719"
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="cf-pulse-dot" />
                Live GPS Complaint Markers ({validGeoReports.length} Plotted)
              </span>
              <span style={{ color: "#695154", fontSize: "11px" }}>
                Click any pin to inspect ticket details
              </span>
            </div>

            <div
              ref={mapContainerRef}
              style={{ width: "100%", height: "460px", backgroundColor: "#f8f6f0" }}
            />
          </div>

          {missingGeoCount > 0 && (
            <div style={{
              padding: "12px 16px",
              backgroundColor: "#FFF9EA",
              border: "1px solid #EAE3D5",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#695154"
            }}>
              ℹ️ {missingGeoCount} complaint{missingGeoCount > 1 ? "s were" : " was"} submitted with manual landmarks and are tracked without GPS map pins.
            </div>
          )}
        </div>
      ) : (
        /* Sector Intelligence View */
        <>
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

          <div className="cf-community-map-grid">
            {/* Interactive Map Visual */}
            <div className="cf-map-canvas-card">
              <div className="cf-map-canvas-header">
                <span className="cf-map-status-live">
                  <span className="cf-pulse-dot" /> Live Municipal Ward Index
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
        </>
      )}
    </div>
  )
}
