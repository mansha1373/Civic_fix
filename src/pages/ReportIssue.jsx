import React, { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"
import ImageUploader from "../components/dashboard/ImageUploader.jsx"
import CategorySelector from "../components/dashboard/CategorySelector.jsx"
import AiSuggestionCard from "../components/dashboard/AiSuggestionCard.jsx"
import LocationPicker from "../components/dashboard/LocationPicker.jsx"
import StatusBadge from "../components/dashboard/StatusBadge.jsx"
import { mockCategories } from "../data/mockReports.js"
import { simulateAiCategoryAnalysis } from "../utils/aiSimulator.js"

export default function ReportIssue() {
  const { addReport, addNotification } = useOutletContext()
  const navigate = useNavigate()

  // Form States
  const [photos, setPhotos] = useState([])
  const [category, setCategory] = useState("potholes")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [locationAddress, setLocationAddress] = useState("Sector 17, Chandigarh")
  const [coordinates, setCoordinates] = useState({ lat: 30.7415, lng: 76.7794 })
  const [urgency, setUrgency] = useState("High")

  // AI Assistant States
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiDismissed, setAiDismissed] = useState(false)

  // Validation & Submission States
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedReport, setSubmittedReport] = useState(null)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Trigger simulated AI classification whenever the first photo is added
  const handlePhotoAdded = async (newPhoto) => {
    if (aiDismissed) return
    setAiAnalyzing(true)
    try {
      const result = await simulateAiCategoryAnalysis(newPhoto.file)
      setAiSuggestion(result)
    } catch {
      // ignore
    } finally {
      setAiAnalyzing(false)
    }
  }

  // Handle AI suggestion application
  const handleApplyAiSuggestion = (suggestedCatKey) => {
    setCategory(suggestedCatKey)
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: null }))
    }
  }

  // Form Validation
  const validateForm = () => {
    const errs = {}

    if (photos.length === 0) {
      errs.photos = "Please upload at least one photograph of the issue."
    }

    if (!category) {
      errs.category = "Please select an issue category."
    }

    if (!locationAddress || locationAddress.trim().length < 5) {
      errs.location = "Please enter or select a valid street address / landmark."
    }

    if (!title || title.trim().length < 5) {
      errs.title = "Please provide an issue title (minimum 5 characters)."
    }

    if (!description || description.trim().length < 15) {
      errs.description = "Please provide a detailed description (minimum 15 characters) to assist municipal field crews."
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to error alert
      window.scrollTo({ top: 200, behavior: "smooth" })
      return
    }

    setIsSubmitting(true)

    // Simulate realistic municipal dispatch submission delay (1.1s)
    await new Promise((resolve) => setTimeout(resolve, 1100))

    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const newId = `CF-2024-${randomNum}`

    const selectedCatObj =
      mockCategories.find((c) => c.id === category) || mockCategories[0]

    // Use primary photo thumbnail for persistent storage
    const primaryThumbnail =
      photos[0]?.storageThumbnail ||
      photos[0]?.previewUrl ||
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"

    const now = new Date()
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })

    const newReport = {
      id: newId,
      title: title.trim(),
      category: selectedCatObj.label,
      categoryKey: category,
      location: locationAddress.trim(),
      coordinates: { ...coordinates },
      pincode: "160017",
      date: formattedDate,
      submittedDate: formattedDate,
      lastUpdated: formattedDate,
      time: formattedTime,
      status: "Submitted",
      statusKey: "submitted",
      urgency,
      upvotes: 1,
      image: primaryThumbnail,
      images: photos.map((p) => p.storageThumbnail || p.previewUrl),
      photoCount: photos.length,
      description: description.trim(),
      department: selectedCatObj.department,
      assignedOfficer: "Pending Field Verification",
      estimatedResolution: "Within 3-5 business days",
      isUserCreated: true,
      officialRemarks: [
        {
          id: `rem-${newId}-1`,
          author: "CivicFix Citizen Central Dispatch",
          role: "MCC Control Room",
          date: `${formattedDate}, ${formattedTime}`,
          message: `Your complaint has been received and registered under ticket #${newId}. Automated notification sent to ${selectedCatObj.department}.`
        }
      ],
      timeline: [
        {
          stage: "Submitted",
          status: "Submitted",
          step: "Report Submitted",
          date: `${formattedDate}, ${formattedTime}`,
          done: true,
          desc: `Received via CivicFix Citizen Portal. Logged under ticket #${newId}.`,
          adminRemarks: "Complaint logged and ticket issued."
        },
        {
          stage: "Under Review",
          status: "Under Review",
          step: "Field Officer Inspection",
          date: "Pending Assignment",
          done: false,
          desc: `Junior Engineer triage and boundary verification by ${selectedCatObj.department}.`,
          adminRemarks: ""
        },
        {
          stage: "In Progress",
          status: "In Progress",
          step: "Work Order Execution",
          date: "Pending",
          done: false,
          desc: "Municipal repair team deployed for on-site physical resolution.",
          adminRemarks: ""
        },
        {
          stage: "Resolved",
          status: "Resolved",
          step: "Final Resolution & Citizen Sign-off",
          date: "Pending",
          done: false,
          desc: "Site photograph uploaded after repairs and citizen verification.",
          adminRemarks: ""
        }
      ]
    }

    // Add report to state and localStorage
    addReport(newReport)

    // Generate a notification for the citizen
    if (addNotification) {
      addNotification({
        id: `notif-${Date.now()}`,
        title: "Complaint Logged",
        message: `Your report #${newId} (${title.slice(0, 35)}...) has been submitted to ${selectedCatObj.department}.`,
        time: "Just now",
        read: false,
        type: "review",
        reportId: newId,
        isUserCreated: true
      })
    }

    setIsSubmitting(false)
    setSubmittedReport(newReport)
    window.scrollTo({ top: 100, behavior: "smooth" })
  }

  // Handle filing another report
  const handleResetForm = () => {
    setSubmittedReport(null)
    setPhotos([])
    setTitle("")
    setDescription("")
    setLocationAddress("Sector 17, Chandigarh")
    setCoordinates({ lat: 30.7415, lng: 76.7794 })
    setCategory("potholes")
    setUrgency("High")
    setAiSuggestion(null)
    setAiDismissed(false)
    setErrors({})
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // --------------------------------------------------------------------------
  // SUCCESS CONFIRMATION SCREEN
  // --------------------------------------------------------------------------
  if (submittedReport) {
    return (
      <div className="cf-page-container">
        <div className="cf-form-success-card">
          <div className="cf-success-icon-wrap">
            <Icon name="checkCircle" size={48} color="#15803D" />
          </div>

          <span className="cf-pill">MUNICIPAL TICKET DISPATCHED</span>
          <h2 className="cf-success-heading">Your report has been submitted successfully!</h2>
          <p className="cf-success-sub">
            Thank you for being an active citizen. Complaint ticket{" "}
            <strong>#{submittedReport.id}</strong> has been logged into the Municipal
            Corporation Chandigarh (MCC) grievance dispatch system.
          </p>

          {/* Ticket Information Summary Card */}
          <div className="cf-success-ticket-summary">
            <div className="summary-row">
              <span>Complaint ID:</span>
              <strong className="cf-ticket-code">#{submittedReport.id}</strong>
            </div>
            <div className="summary-row">
              <span>Issue Category:</span>
              <strong>{submittedReport.category}</strong>
            </div>
            <div className="summary-row">
              <span>Location:</span>
              <strong>{submittedReport.location}</strong>
            </div>
            <div className="summary-row">
              <span>GPS Geotag:</span>
              <small>
                {submittedReport.coordinates?.lat}° N, {submittedReport.coordinates?.lng}° E
              </small>
            </div>
            <div className="summary-row">
              <span>Submission Date:</span>
              <span>{submittedReport.date} at {submittedReport.time}</span>
            </div>
            <div className="summary-row">
              <span>Current Status:</span>
              <StatusBadge status={submittedReport.status} />
            </div>
            <div className="summary-row">
              <span>Responsible Agency:</span>
              <small>{submittedReport.department}</small>
            </div>
            <div className="summary-row">
              <span>Photographs Attached:</span>
              <span>{submittedReport.photoCount || 1} Photo(s)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cf-success-actions">
            <button
              type="button"
              className="cf-button cf-track-report-btn"
              onClick={() => navigate(`/dashboard/reports/${submittedReport.id}`)}
            >
              <Icon name="myReports" size={17} />
              <span>Track My Report</span>
            </button>

            <button
              type="button"
              className="cf-button dark cf-dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              <Icon name="overview" size={17} />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="button"
              className="cf-outline-btn"
              onClick={handleResetForm}
            >
              <Icon name="plusCircle" size={17} />
              <span>File Another Report</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // MAIN REPORT FORM
  // --------------------------------------------------------------------------
  return (
    <div className="cf-page-container">
      {/* 1. Page Header */}
      <div className="cf-page-header">
        <div>
          <div className="cf-welcome-pill">
            <span className="cf-live-dot" />
            <span>STAGE 2 · CITIZEN ISSUE REPORTING</span>
          </div>
          <h1 className="cf-page-title">Report a Civic Issue</h1>
          <p className="cf-page-subtitle">
            Spotted something that needs fixing? Report it and help make your neighbourhood better.
          </p>
        </div>
      </div>

      {/* Global Validation Banner if form has errors */}
      {Object.keys(errors).length > 0 && (
        <div className="cf-form-validation-banner" role="alert">
          <Icon name="alertTriangle" size={20} color="#B91C1C" />
          <div className="banner-copy">
            <strong>Please resolve the following before submitting:</strong>
            <ul>
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form className="cf-report-form" onSubmit={handleSubmit} noValidate>
        {/* SECTION 1: Image Upload System */}
        <section className="cf-form-section">
          <div className="cf-section-legend">
            <span className="cf-step-number">1</span>
            <div>
              <h2 className="cf-form-section-title">
                Issue Photographs <span className="cf-required-star">*</span>
              </h2>
              <p className="cf-form-section-subtitle">
                Upload clear photographs of the civic hazard from your gallery or capture using your camera.
              </p>
            </div>
          </div>

          <ImageUploader
            photos={photos}
            setPhotos={setPhotos}
            onPhotoAdded={handlePhotoAdded}
            error={errors.photos}
          />
        </section>

        {/* SECTION 2: AI-Assisted Category Suggestion */}
        {(aiAnalyzing || (aiSuggestion && !aiDismissed)) && (
          <section className="cf-form-section cf-ai-section-fade">
            <AiSuggestionCard
              suggestion={aiSuggestion}
              analyzing={aiAnalyzing}
              currentCategory={category}
              onApplySuggestion={handleApplyAiSuggestion}
              onDismiss={() => setAiDismissed(true)}
            />
          </section>
        )}

        {/* SECTION 3: Issue Category Selection */}
        <section className="cf-form-section">
          <div className="cf-section-legend">
            <span className="cf-step-number">2</span>
            <div>
              <h2 className="cf-form-section-title">
                Select Issue Category <span className="cf-required-star">*</span>
              </h2>
              <p className="cf-form-section-subtitle">
                Choose the primary category that best describes the civic hazard.
              </p>
            </div>
          </div>

          <CategorySelector
            selectedCategory={category}
            onSelectCategory={(catId) => {
              setCategory(catId)
              if (errors.category) {
                setErrors((prev) => ({ ...prev, category: null }))
              }
            }}
            error={errors.category}
          />
        </section>

        {/* SECTION 4: Location Details (Leaflet Map & GPS) */}
        <section className="cf-form-section">
          <div className="cf-section-legend">
            <span className="cf-step-number">3</span>
            <div>
              <h2 className="cf-form-section-title">
                Issue Location <span className="cf-required-star">*</span>
              </h2>
              <p className="cf-form-section-subtitle">
                Pinpoint the exact location using GPS, the interactive map, or manual address input.
              </p>
            </div>
          </div>

          <LocationPicker
            locationAddress={locationAddress}
            setLocationAddress={(addr) => {
              setLocationAddress(addr)
              if (errors.location) {
                setErrors((prev) => ({ ...prev, location: null }))
              }
            }}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            error={errors.location}
          />
        </section>

        {/* SECTION 5: Issue Description & Priority */}
        <section className="cf-form-section">
          <div className="cf-section-legend">
            <span className="cf-step-number">4</span>
            <div>
              <h2 className="cf-form-section-title">
                Issue Details & Description <span className="cf-required-star">*</span>
              </h2>
              <p className="cf-form-section-subtitle">
                Provide specifics so the municipal inspection officer can verify quickly.
              </p>
            </div>
          </div>

          {/* Title Field */}
          <div className="cf-form-group">
            <label htmlFor="issue-title" className="cf-field-label">
              Issue Title <span className="cf-required-star">*</span>
            </label>
            <input
              id="issue-title"
              type="text"
              className={`cf-input ${errors.title ? "has-error" : ""}`}
              placeholder="e.g., Deep pothole cluster near Sector 17-C roundabout"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }))
              }}
              maxLength={120}
              aria-required="true"
              aria-invalid={Boolean(errors.title)}
            />
            <div className="cf-field-meta-row">
              {errors.title ? (
                <span className="cf-field-error-text">{errors.title}</span>
              ) : (
                <span className="cf-field-hint">Be concise and include a prominent landmark.</span>
              )}
              <span className="cf-char-count">{title.length} / 120</span>
            </div>
          </div>

          {/* Description Field */}
          <div className="cf-form-group">
            <label htmlFor="issue-desc" className="cf-field-label">
              Detailed Description <span className="cf-required-star">*</span>
            </label>
            <textarea
              id="issue-desc"
              rows={4}
              className={`cf-textarea ${errors.description ? "has-error" : ""}`}
              placeholder="Describe the severity, depth, whether traffic or pedestrians are blocked, and any safety hazards for commuters..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: null }))
                }
              }}
              maxLength={1000}
              aria-required="true"
              aria-invalid={Boolean(errors.description)}
            />
            <div className="cf-field-meta-row">
              {errors.description ? (
                <span className="cf-field-error-text">{errors.description}</span>
              ) : (
                <span className="cf-field-hint">
                  Minimum 15 characters. Clear descriptions reduce inspection turnaround by 48 hours.
                </span>
              )}
              <span className="cf-char-count">{description.length} / 1000</span>
            </div>
          </div>

          {/* Urgency Selector */}
          <div className="cf-form-group">
            <label className="cf-field-label">
              Estimated Priority Level
            </label>
            <div className="cf-urgency-selector" role="radiogroup" aria-label="Select urgency level">
              {[
                { lvl: "Low", desc: "Non-hazardous minor defect" },
                { lvl: "Medium", desc: "Moderate disruption to traffic" },
                { lvl: "High", desc: "Immediate hazard for vehicles/pedestrians" },
                { lvl: "Critical", desc: "Emergency safety danger" }
              ].map(({ lvl, desc }) => (
                <button
                  type="button"
                  key={lvl}
                  role="radio"
                  aria-checked={urgency === lvl}
                  className={`cf-urgency-btn ${lvl.toLowerCase()} ${
                    urgency === lvl ? "active" : ""
                  }`}
                  onClick={() => setUrgency(lvl)}
                >
                  <span className="urgency-name">{lvl}</span>
                  <small className="urgency-sub">{desc}</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: Form Actions */}
        <div className="cf-form-actions-bar">
          <button
            type="submit"
            className={`cf-button cf-submit-report-btn ${isSubmitting ? "busy" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="cf-spinner" />
                <span>Transmitting Report to MCC Dispatch...</span>
              </>
            ) : (
              <>
                <Icon name="check" size={18} />
                <span>Submit Civic Complaint</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="cf-button dark cf-cancel-btn"
            onClick={() => navigate("/dashboard")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
