import React, { useState } from "react"
import { Icon } from "../components/dashboard/Icons.jsx"

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsUpdates, setSmsUpdates] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [language, setLanguage] = useState("en")
  const [locationPrivacy, setLocationPrivacy] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="cf-page-container">
      <div className="cf-page-header">
        <div>
          <span className="cf-pill">ACCOUNT PREFERENCES</span>
          <h1 className="cf-page-title">Settings</h1>
          <p className="cf-page-subtitle">
            Configure notifications, SMS alerts for complaint status, language and privacy preferences.
          </p>
        </div>
      </div>

      <div className="cf-settings-container">
        {saved && (
          <div className="cf-alert success" style={{ marginBottom: "20px" }}>
            <Icon name="checkCircle" size={18} color="#15803D" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Notification Preferences */}
          <div className="cf-settings-card">
            <h3 className="cf-detail-card-title">Notification Channels</h3>
            <p className="cf-settings-card-sub">
              Control how and when you receive progress alerts about your complaints.
            </p>

            <div className="cf-toggle-row">
              <div className="toggle-info">
                <strong>Email Notifications</strong>
                <span>Receive work order and status changes in your inbox</span>
              </div>
              <label className="cf-switch">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
                <span className="slider round" />
              </label>
            </div>

            <div className="cf-toggle-row">
              <div className="toggle-info">
                <strong>SMS Status Updates</strong>
                <span>Get SMS when municipal crews are dispatched to your reported site</span>
              </div>
              <label className="cf-switch">
                <input
                  type="checkbox"
                  checked={smsUpdates}
                  onChange={(e) => setSmsUpdates(e.target.checked)}
                />
                <span className="slider round" />
              </label>
            </div>

            <div className="cf-toggle-row">
              <div className="toggle-info">
                <strong>Weekly Sector Digest</strong>
                <span>A weekly summary of resolved issues in your ward</span>
              </div>
              <label className="cf-switch">
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                />
                <span className="slider round" />
              </label>
            </div>
          </div>

          {/* Language & Regional Settings */}
          <div className="cf-settings-card">
            <h3 className="cf-detail-card-title">Language & Regional Preferences</h3>
            <p className="cf-settings-card-sub">Choose your preferred language for the citizen portal.</p>

            <div className="cf-language-options">
              {[
                { code: "en", label: "English", sub: "Default language" },
                { code: "hi", label: "हिन्दी (Hindi)", sub: "राजभाषा" },
                { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", sub: "ਖੇਤਰੀ ਭਾਸ਼ਾ" }
              ].map((lang) => (
                <label
                  key={lang.code}
                  className={`cf-lang-card ${language === lang.code ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang.code}
                    checked={language === lang.code}
                    onChange={() => setLanguage(lang.code)}
                  />
                  <div>
                    <strong>{lang.label}</strong>
                    <small>{lang.sub}</small>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy & Location */}
          <div className="cf-settings-card">
            <h3 className="cf-detail-card-title">Privacy & Public Visibility</h3>
            <p className="cf-settings-card-sub">
              Manage how your name appears on public neighbourhood report boards.
            </p>

            <div className="cf-toggle-row">
              <div className="toggle-info">
                <strong>Show my name on public report feed</strong>
                <span>When turned off, reports will be attributed as "Verified Resident"</span>
              </div>
              <label className="cf-switch">
                <input
                  type="checkbox"
                  checked={locationPrivacy}
                  onChange={(e) => setLocationPrivacy(e.target.checked)}
                />
                <span className="slider round" />
              </label>
            </div>
          </div>

          <div className="cf-form-actions" style={{ marginTop: "24px" }}>
            <button type="submit" className="cf-button">
              Save All Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
