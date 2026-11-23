import React, { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Icon } from "./Icons.jsx"

export default function Topbar({
  user,
  unreadCount = 0,
  notifications = [],
  onLogout,
  onOpenMobileSidebar,
  searchQuery,
  setSearchQuery
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Page title mapping based on pathname
  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === "/dashboard") return { section: "Dashboard", title: "Overview" }
    if (path.startsWith("/dashboard/reports/")) return { section: "My Reports", title: "Report Details" }
    if (path === "/dashboard/reports" || path.startsWith("/dashboard/reports")) return { section: "Complaints", title: "My Reports" }
    if (path === "/dashboard/report" || path.startsWith("/dashboard/report")) return { section: "Complaints", title: "Report an Issue" }
    if (path.startsWith("/dashboard/map")) return { section: "Community", title: "Community Map" }
    if (path.startsWith("/dashboard/notifications")) return { section: "Updates", title: "Notifications" }
    if (path.startsWith("/dashboard/impact")) return { section: "Community", title: "Community Impact" }
    if (path.startsWith("/dashboard/profile")) return { section: "Account", title: "My Profile" }
    if (path.startsWith("/dashboard/settings")) return { section: "Preferences", title: "Settings" }
    return { section: "Dashboard", title: "Overview" }
  }

  const breadcrumb = getBreadcrumb()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery && searchQuery.trim()) {
      navigate(`/dashboard/reports?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="cf-topbar">
      {/* Left: Mobile Menu Toggle & Breadcrumbs */}
      <div className="cf-topbar-left">
        <button
          type="button"
          className="cf-menu-toggle mobile-only"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={22} />
        </button>

        <div className="cf-breadcrumbs">
          <span className="cf-breadcrumb-section">{breadcrumb.section}</span>
          <span className="cf-breadcrumb-separator">/</span>
          <h1 className="cf-breadcrumb-title">{breadcrumb.title}</h1>
        </div>
      </div>

      {/* Middle: Quick Search */}
      <div className="cf-topbar-center">
        <form className="cf-topbar-search-form" onSubmit={handleSearchSubmit}>
          <Icon name="search" size={17} className="cf-search-icon" />
          <input
            type="text"
            className="cf-topbar-search-input"
            placeholder="Search complaints, sectors, IDs (e.g. CF-2024-8921)..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="cf-search-clear-btn"
              onClick={() => setSearchQuery && setSearchQuery("")}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Right: Notification Bell, Profile Avatar & Dropdown */}
      <div className="cf-topbar-right">
        {/* Notification Bell Dropdown */}
        <div className="cf-dropdown-wrapper" ref={notifRef}>
          <button
            type="button"
            className="cf-topbar-icon-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
          >
            <Icon name="bell" size={20} />
            {unreadCount > 0 && <span className="cf-notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="cf-popover-menu cf-notif-popover">
              <div className="cf-popover-header">
                <strong>Notifications ({unreadCount} unread)</strong>
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="cf-popover-link"
                >
                  View all
                </Link>
              </div>
              <div className="cf-popover-list">
                {notifications.slice(0, 4).map((n) => (
                  <Link
                    key={n.id}
                    to={n.reportId ? `/dashboard/reports/${n.reportId}` : "/dashboard/notifications"}
                    className={`cf-popover-item ${!n.read ? "unread" : ""}`}
                    onClick={() => setNotifOpen(false)}
                  >
                    <span className="cf-popover-dot" />
                    <div>
                      <p className="cf-popover-text">
                        <strong>{n.title}:</strong> {n.message}
                      </p>
                      <small className="cf-popover-time">{n.time}</small>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="cf-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="cf-profile-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || "Citizen"}
                className="cf-topbar-avatar"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="cf-topbar-avatar-fallback">
                {(user?.name || "Citizen").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="cf-profile-trigger-info desktop-only">
              <span className="cf-profile-name">{user?.name || "Citizen"}</span>
              <span className="cf-profile-sub">Citizen · Sector 17</span>
            </div>
            <Icon name="chevronDown" size={15} className="desktop-only cf-chevron-icon" />
          </button>

          {dropdownOpen && (
            <div className="cf-popover-menu cf-profile-popover">
              <div className="cf-profile-popover-header">
                <strong>{user?.name || "Citizen"}</strong>
                <small>{user?.email || "citizen@civicfix.in"}</small>
                <span className="cf-status-tag" style={{ marginTop: "6px" }}>Verified Citizen</span>
              </div>
              <div className="cf-popover-divider" />
              <Link
                to="/dashboard/profile"
                className="cf-popover-menu-item"
                onClick={() => setDropdownOpen(false)}
              >
                <Icon name="profile" size={17} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/dashboard/settings"
                className="cf-popover-menu-item"
                onClick={() => setDropdownOpen(false)}
              >
                <Icon name="settings" size={17} />
                <span>Settings</span>
              </Link>
              <Link
                to="/"
                className="cf-popover-menu-item"
                onClick={() => setDropdownOpen(false)}
              >
                <Icon name="overview" size={17} />
                <span>CivicFix Home</span>
              </Link>
              <div className="cf-popover-divider" />
              <button
                type="button"
                className="cf-popover-menu-item cf-logout-item"
                onClick={() => {
                  setDropdownOpen(false)
                  onLogout()
                }}
              >
                <Icon name="logout" size={17} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
