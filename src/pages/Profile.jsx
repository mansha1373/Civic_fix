import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"

export default function Profile() {
  const { user, reports = [], updateProfile } = useOutletContext() || {}

  const [form, setForm] = useState({
    name: user?.name || "Citizen",
    email: user?.email || "",
    phone: user?.phone || "+91 98765 43210",
    city: user?.city || "Chandigarh",
    sector: user?.sector || "Sector 17",
    bio: user?.bio || "Active resident passionate about neighbourhood improvements and civic maintenance."
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "+91 98765 43210",
        city: user.city || "Chandigarh",
        sector: user.sector || "Sector 17",
        bio: user.bio || "Active resident passionate about neighbourhood improvements and civic maintenance."
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      if (updateProfile) {
        await updateProfile(form)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const reportsCount = reports.length
  const resolvedCount = reports.filter((r) => (r.status || "").toLowerCase() === "resolved").length
  const civicPoints = reportsCount * 25 + resolvedCount * 50

  return (
    <div className="cf-page-container">
      <div className="cf-page-header">
        <div>
          <span className="cf-pill">CITIZEN IDENTITY</span>
          <h1 className="cf-page-title">My Profile</h1>
          <p className="cf-page-subtitle">
            Manage your personal details, municipal ward association, and civic credentials in MongoDB Atlas.
          </p>
        </div>
      </div>

      <div className="cf-profile-layout-grid">
        {/* Left Card: Profile Overview & Badges */}
        <div className="cf-profile-card">
          <div className="cf-profile-avatar-large">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={form.name} referrerPolicy="no-referrer" />
            ) : (
              <div className="cf-avatar-fallback-lg">
                {(form.name || "C").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="cf-profile-card-name">{form.name}</h2>
          <span className="cf-status-tag" style={{ margin: "4px 0 12px" }}>
            Verified Resident · {form.sector || "Sector 17"}
          </span>
          <p className="cf-profile-card-bio">{form.bio}</p>

          <div className="cf-profile-stats-bar">
            <div className="p-stat">
              <b>{reportsCount}</b>
              <small>Reports Filed</small>
            </div>
            <div className="p-stat">
              <b>{resolvedCount}</b>
              <small>Resolved</small>
            </div>
            <div className="p-stat">
              <b>{civicPoints}</b>
              <small>Civic Points</small>
            </div>
          </div>

          <div className="cf-profile-badge-item">
            <Icon name="award" size={24} color="#59343B" />
            <div>
              <strong>Neighbourhood Champion</strong>
              <small>Role: {user?.role ? user.role.toUpperCase() : "CITIZEN"}</small>
            </div>
          </div>
        </div>

        {/* Right Card: Editable Profile Form */}
        <div className="cf-profile-form-card">
          <h3 className="cf-detail-card-title">Personal & Ward Information</h3>

          {saved && (
            <div className="cf-alert success" style={{ marginBottom: "16px" }}>
              <Icon name="checkCircle" size={18} color="#15803D" />
              <span>Profile information saved to MongoDB Atlas successfully!</span>
            </div>
          )}

          {error && (
            <div className="cf-alert" style={{ marginBottom: "16px", backgroundColor: "#FAECEE", color: "#8C2329" }}>
              <Icon name="alertCircle" size={18} color="#8C2329" />
              <span>{error}</span>
            </div>
          )}

          <form className="cf-form" onSubmit={handleSubmit}>
            <div className="cf-form-row">
              <div className="cf-form-group">
                <label className="cf-field-label">Full Name</label>
                <input
                  type="text"
                  className="cf-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="cf-form-group">
                <label className="cf-field-label">Email Address (Registered Account)</label>
                <input
                  type="email"
                  className="cf-input"
                  value={form.email}
                  readOnly
                  disabled
                  style={{ backgroundColor: "#F7F4EB", cursor: "not-allowed", opacity: 0.8 }}
                />
              </div>
            </div>

            <div className="cf-form-row">
              <div className="cf-form-group">
                <label className="cf-field-label">Mobile Phone Number</label>
                <input
                  type="tel"
                  className="cf-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="cf-form-group">
                <label className="cf-field-label">City / Region</label>
                <input
                  type="text"
                  className="cf-input"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            </div>

            <div className="cf-form-group">
              <label className="cf-field-label">Ward / Sector Details</label>
              <input
                type="text"
                className="cf-input"
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
              />
            </div>

            <div className="cf-form-group">
              <label className="cf-field-label">Short Bio</label>
              <textarea
                className="cf-textarea"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            <div className="cf-form-actions" style={{ marginTop: "12px" }}>
              <button type="submit" disabled={saving} className="cf-button">
                {saving ? "Saving to MongoDB..." : "Save Profile Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
