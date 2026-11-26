import React, { useState, useEffect, useRef } from "react"
import { useParams, Link, useOutletContext, useNavigate } from "react-router-dom"
import L from "leaflet"
import { Icon } from "../components/dashboard/Icons.jsx"
import StatusBadge from "../components/dashboard/StatusBadge.jsx"
import { getReportById } from "../services/civicfixService.js"

// Custom SVG Pin Icon for Leaflet
const createCivicPinIcon = () => {
  return L.divIcon({
    className: "cf-leaflet-custom-marker",
    html: `
      <div class="cf-leaflet-pin-wrapper">
        <div class="cf-leaflet-pin-bubble">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#281719" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#FFD20A" />
            <circle cx="12" cy="10" r="3" fill="#59343B" />
          </svg>
        </div>
        <div class="cf-leaflet-pin-pulse"></div>
      </div>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40]
  })
}

export default function ReportDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { reports = [] } = useOutletContext() || {}

  const [report, setReport] = useState(() => reports.find((r) => r.id === id || r.complaintId === id) || null)
  const [loading, setLoading] = useState(!report)
  const [error, setError] = useState("")
  const [selectedImg, setSelectedImg] = useState(null)
  const mapContainerRef = useRef(null)
  const mapInstance = useRef(null)

  // Fetch verified report from backend if not in cache or for live freshness
  useEffect(() => {
    let isMounted = true
    async function fetchComplaint() {
      try {
        setLoading(true)
        setError("")
        const liveReport = await getReportById(id)
        if (isMounted && liveReport) {
          setReport(liveReport)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `No complaint found with ID "${id}"`)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (id) {
      fetchComplaint()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  const activePhoto =
    selectedImg ||
    report?.image ||
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"

  // Initialize interactive Leaflet map
  useEffect(() => {
    if (!report || !mapContainerRef.current) return

    // Coordinates: use report's coordinates or Tricity default
    const lat = report.coordinates?.lat || 30.7415
    const lng = report.coordinates?.lng || 76.7794

    // Clean up previous map instance if any
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      const marker = L.marker([lat, lng], {
        icon: createCivicPinIcon()
      }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 4px; max-width: 200px;">
          <strong style="color: #59343B; font-size: 12px; display: block;">${report.id || report.complaintId}</strong>
          <span style="font-size: 11px; font-weight: 600; color: #281719; display: block; margin: 2px 0;">${report.category}</span>
          <p style="font-size: 11px; color: #5e474b; margin: 0; line-height: 1.3;">${report.location}</p>
        </div>
      `).openPopup()

      mapInstance.current = map

      // Invalidate size to ensure tiles render smoothly
      setTimeout(() => {
        map.invalidateSize()
      }, 250)
    } catch {
      // Ignore Leaflet re-init errors
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [report])

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "#695154" }}>
        <p>Loading complaint details from MongoDB Atlas...</p>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="cf-empty-state-card" style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE3D5",
        borderRadius: "1.25rem",
        padding: "48px 24px",
        textAlign: "center"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: "#FAECEE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          color: "#8C2329"
        }}>
          <Icon name="alertCircle" size={24} color="#8C2329" />
        </div>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#281719", marginBottom: "8px" }}>
          {error.includes("denied") ? "Access Denied" : "Complaint Not Found"}
        </h2>
        <p style={{ fontSize: "13px", color: "#695154", maxWidth: "420px", margin: "0 auto 20px" }}>
          {error || `The complaint ID "${id}" could not be located in your records.`}
        </p>
        <button
          type="button"
          className="cf-button"
          onClick={() => navigate("/dashboard/reports")}
        >
          Return to My Reports
        </button>
      </div>
    )
  }

  // Construct vertical timeline stages
  const isRejected = (report.status || "").toLowerCase() === "rejected"
  const defaultTimeline = isRejected
    ? [
        {
          stage: "Submitted",
          step: "Report Submitted",
          date: `${report.submittedDate || report.date}, ${report.time || "Morning"}`,
          done: true,
          desc: "Citizen registered complaint via CivicFix citizen portal.",
          adminRemarks: "Complaint logged and ticket issued."
        },
        {
          stage: "Under Review",
          step: "Jurisdiction & Boundary Verification",
          date: report.lastUpdated || report.date,
          done: true,
          desc: "Municipal GIS boundary mapping reviewed location jurisdiction.",
          adminRemarks: "Private society property boundary identified."
        },
        {
          stage: "Rejected",
          step: "Complaint Rejected",
          date: report.lastUpdated || report.date,
          done: true,
          desc: "Outside Municipal Corporation jurisdiction as per Section 34 of Municipal Act.",
          adminRemarks: "Referred to Society RWA Management."
        }
      ]
    : [
        {
          stage: "Submitted",
          step: "Report Submitted",
          date: `${report.submittedDate || report.date}, ${report.time || "Morning"}`,
          done: true,
          desc: "Received and logged under CivicFix verified citizen records.",
          adminRemarks: "Complaint logged and ticket issued."
        },
        {
          stage: "Under Review",
          step: "Under Field Review",
          date:
            (report.status || "").toLowerCase() === "submitted"
              ? "Pending"
              : report.lastUpdated || report.date,
          done: (report.status || "").toLowerCase() !== "submitted",
          desc: `Triage and boundary inspection assigned to ${report.department || "Municipal Corporation"}.`,
          adminRemarks:
            (report.status || "").toLowerCase() !== "submitted"
              ? "Department jurisdiction confirmed."
              : ""
        },
        {
          stage: "In Progress",
          step: "Work Order In Progress",
          date:
            ["in progress", "resolved"].includes((report.status || "").toLowerCase())
              ? report.lastUpdated || report.date
              : "Pending",
          done: ["in progress", "resolved"].includes((report.status || "").toLowerCase()),
          desc: "Field repair team dispatched with materials for physical on-site rectification.",
          adminRemarks:
            ["in progress", "resolved"].includes((report.status || "").toLowerCase())
              ? "Field work order active."
              : ""
        },
        {
          stage: "Resolved",
          step: "Resolved & Verified",
          date:
            (report.status || "").toLowerCase() === "resolved"
              ? report.resolvedDate || report.lastUpdated || report.date
              : "Pending",
          done: (report.status || "").toLowerCase() === "resolved",
          desc: "Physical repairs completed on site with photographic verification.",
          adminRemarks:
            (report.status || "").toLowerCase() === "resolved"
              ? "Verified by supervising engineer."
              : ""
        }
      ]

  const timelineEvents =
    report.timeline && report.timeline.length > 0 ? report.timeline : defaultTimeline

  // Fallback official remarks if none configured
  const officialRemarksList =
    report.officialRemarks && report.officialRemarks.length > 0
      ? report.officialRemarks
      : [
          {
            id: `rem-auto-1`,
            author: "MCC Central Citizen Grievance Cell",
            role: "Control Room",
            date: `${report.submittedDate || report.date}, ${report.time || "10:00 AM"}`,
            message: `Your complaint has been received and registered under ticket #${report.id}. Automated notification sent to ${report.department || "Municipal Corporation"}.`
          },
          ...(report.status !== "Submitted"
            ? [
                {
                  id: `rem-auto-2`,
                  author: report.assignedOfficer || "Duty Officer",
                  role: report.department || "Municipal Authority",
                  date: `${report.lastUpdated || report.date}`,
                  message: `The concerned department has been notified. Status currently marked as: ${report.status}.`
                }
              ]
            : [])
        ]

  return (
    <div className="cf-page-container">
      {/* Back and Breadcrumbs */}
      <div className="cf-detail-top-nav">
        <Link to="/dashboard/reports" className="cf-back-link">
          <Icon name="chevronLeft" size={18} />
          <span>Back to My Reports</span>
        </Link>
        <span className="cf-detail-ticket-id">Complaint #{report.id}</span>
      </div>

      {/* 3.A Main Report Header Information */}
      <div className="cf-detail-header-card">
        <div className="cf-detail-header-info">
          <div className="cf-detail-tags-row">
            <span className="cf-category-tag">{report.category}</span>
            <StatusBadge status={report.status} />
            <span className={`cf-urgency-tag ${(report.urgency || "medium").toLowerCase()}`}>
              Priority: {report.urgency || "Normal"}
            </span>
          </div>
          <h1 className="cf-detail-title">{report.title}</h1>
          <div className="cf-detail-meta-list">
            <span>
              <Icon name="calendar" size={15} />
              Submitted: {report.submittedDate || report.date} at {report.time || "Morning"}
            </span>
            <span>
              <Icon name="clock" size={15} />
              Last Updated: {report.lastUpdated || report.date}
            </span>
            <span>
              <Icon name="mapPin" size={15} />
              {typeof report.location === "object"
                ? (report.location?.address || report.location?.sector || "Sector 17, Chandigarh")
                : (report.location || "Sector 17, Chandigarh")}
            </span>
            <span>
              <Icon name="thumbsUp" size={15} />
              {report.upvotes || 1} Citizens Supported
            </span>
          </div>
        </div>

        <div className="cf-detail-header-actions">
          <button
            type="button"
            className="cf-button"
            onClick={() => alert(`Complaint reference #${report.id} link copied to clipboard!`)}
          >
            <Icon name="share" size={16} />
            <span>Share Ticket</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Left Column (Photos, Description, Map, Resolution) & Right Column (Timeline, Official Remarks) */}
      <div className="cf-detail-grid">
        {/* Left Column */}
        <div className="cf-detail-left-col">
          {/* Site Photographs Card */}
          <div className="cf-detail-card">
            <div className="cf-detail-card-head-row">
              <h3 className="cf-detail-card-title">Site Photo Evidence</h3>
              {report.images && report.images.length > 1 && (
                <span className="cf-photo-count-badge">
                  {report.images.length} Photographs Attached
                </span>
              )}
            </div>

            <div className="cf-detail-media">
              <img
                src={activePhoto}
                alt={report.title}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                }}
              />
            </div>

            {report.images && report.images.length > 1 && (
              <div className="cf-detail-thumb-strip">
                {report.images.map((imgUrl, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`cf-detail-thumb-btn ${activePhoto === imgUrl ? "active" : ""}`}
                    onClick={() => setSelectedImg(imgUrl)}
                    title={`View photo ${i + 1}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Issue Description Card */}
          <div className="cf-detail-card">
            <h3 className="cf-detail-card-title">Detailed Citizen Description</h3>
            <p className="cf-detail-desc-text">{report.description}</p>
          </div>

          {/* 3.B Location & Interactive Map Card */}
          <div className="cf-detail-card cf-detail-map-card">
            <div className="cf-detail-card-head-row">
              <h3 className="cf-detail-card-title">Reported Location & Map</h3>
              <span className="cf-photo-count-badge">
                <Icon name="mapPin" size={12} style={{ display: "inline", verticalAlign: "-1px" }} />
                <span>Geotagged</span>
              </span>
            </div>

            {/* Interactive Leaflet Map Canvas */}
            <div
              ref={mapContainerRef}
              className="cf-detail-map-canvas"
              aria-label="Interactive map showing reported issue location"
            />

            <div className="cf-detail-location-bar">
              <div>
                <strong>
                  {typeof report.location === "object"
                    ? (report.location?.address || report.location?.sector || "Sector 17, Chandigarh")
                    : (report.location || "Sector 17, Chandigarh")}
                </strong>
                {report.pincode && <span> (PIN: {report.pincode})</span>}
              </div>
              {report.coordinates && (
                <span className="cf-detail-location-coords">
                  {report.coordinates.lat.toFixed(4)}° N, {report.coordinates.lng.toFixed(4)}° E
                </span>
              )}
            </div>
          </div>

          {/* 3.E Resolution Photographs Section */}
          <div className="cf-resolution-card">
            <div className="cf-detail-card-head-row">
              <h3 className="cf-detail-card-title">Resolution Verification</h3>
              <StatusBadge status={report.status} />
            </div>

            {report.status === "Resolved" && report.resolution ? (
              <div>
                <p className="cf-step-desc">
                  Official on-site before and after photographs verifying the completed civic repair:
                </p>

                <div className="cf-before-after-grid">
                  {/* Before Photo */}
                  <div className="cf-before-after-pane">
                    <img
                      src={report.resolution.beforeImage || report.image}
                      alt="Before civic repair"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                      }}
                    />
                    <span className="cf-before-tag">BEFORE</span>
                  </div>

                  {/* After Photo */}
                  <div className="cf-before-after-pane">
                    <img
                      src={report.resolution.afterImage}
                      alt="After civic repair"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80"
                      }}
                    />
                    <span className="cf-after-tag">AFTER RESOLUTION</span>
                  </div>
                </div>

                <div className="cf-resolution-meta-box">
                  <div className="cf-resolution-date-row">
                    <span>
                      <Icon name="checkCircle" size={14} style={{ display: "inline", verticalAlign: "-2px" }} />
                      <span>Resolution Completed</span>
                    </span>
                    <span>{report.resolution.date || report.resolvedDate}</span>
                  </div>
                  <p className="cf-resolution-desc">{report.resolution.description}</p>
                  {report.resolution.verifiedBy && (
                    <span className="cf-resolution-signoff">
                      Verified by: {report.resolution.verifiedBy}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Unresolved State */
              <div className="cf-resolution-pending-box">
                <Icon name="clock" size={32} color="#B45309" />
                <strong style={{ color: "#281719" }}>Resolution In Progress</strong>
                <p>
                  Official before-and-after photographic verification will be published here as soon as the
                  supervising municipal engineer inspects and approves the completed work order.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="cf-detail-right-col">
          {/* 3.C Vertical Status Tracking Timeline */}
          <div className="cf-detail-card">
            <div className="cf-detail-card-head-row">
              <h3 className="cf-detail-card-title">Status Tracking Timeline</h3>
              <span className="cf-photo-count-badge">Live Updates</span>
            </div>

            <div className="cf-timeline-stepper">
              {timelineEvents.map((step, idx) => {
                const isStepDone = Boolean(step.done)
                const isStepRejected =
                  step.stage === "Rejected" || (report.status === "Rejected" && idx === timelineEvents.length - 1)

                return (
                  <div
                    key={step.step || idx}
                    className={`cf-timeline-step ${isStepDone ? "done" : "pending"} ${
                      isStepRejected ? "rejected" : ""
                    }`}
                  >
                    <div className="cf-timeline-indicator">
                      <div className="cf-timeline-dot">
                        {isStepRejected ? (
                          <Icon name="close" size={13} />
                        ) : isStepDone ? (
                          <Icon name="check" size={13} />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      {idx < timelineEvents.length - 1 && <div className="cf-timeline-line" />}
                    </div>

                    <div className="cf-timeline-step-content">
                      <div className="cf-step-top">
                        <strong className="cf-step-name">{step.step || step.stage}</strong>
                        <span className="cf-step-date">{step.date}</span>
                      </div>
                      <p className="cf-step-desc">{step.desc}</p>

                      {/* Optional Administrative Remarks */}
                      {step.adminRemarks && (
                        <div className="cf-timeline-remarks-box">
                          <strong>Official Note:</strong>
                          <span>{step.adminRemarks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3.D Official Remarks / Government Comments */}
          <div className="cf-official-remarks-card">
            <div className="cf-detail-card-head-row">
              <h3 className="cf-detail-card-title">Official Municipal Remarks</h3>
              <span className="cf-simulated-badge">DEMO DATA · SIMULATED</span>
            </div>

            <div className="cf-official-remarks-list">
              {officialRemarksList.map((remark) => (
                <div key={remark.id} className="cf-official-remark-item">
                  <div className="cf-remark-header">
                    <div className="cf-remark-author-info">
                      <div className="cf-remark-avatar">
                        {(remark.author || "M")[0]}
                      </div>
                      <div>
                        <div className="cf-remark-author-name">{remark.author}</div>
                        <span className="cf-remark-role-tag">{remark.role}</span>
                      </div>
                    </div>
                    <span className="cf-remark-date">{remark.date}</span>
                  </div>
                  <p className="cf-remark-message">{remark.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Department Assignment Card */}
          <div className="cf-detail-card">
            <h3 className="cf-detail-card-title">Jurisdiction & Department</h3>
            <div className="cf-department-info">
              <div className="dept-item">
                <span className="dept-label">Responsible Agency:</span>
                <strong className="dept-val">{report.department || "Municipal Corporation"}</strong>
              </div>
              <div className="dept-item">
                <span className="dept-label">Assigned Field Officer:</span>
                <strong className="dept-val">{report.assignedOfficer || "Pending Assignment"}</strong>
              </div>
              <div className="dept-item">
                <span className="dept-label">Target Resolution:</span>
                <strong className="dept-val">{report.estimatedResolution || "Within 3-5 business days"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
