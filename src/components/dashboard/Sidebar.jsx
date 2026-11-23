import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Icon } from "./Icons.jsx"

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  user,
  unreadCount = 0,
  onLogout
}) {
  const location = useLocation()

  const navItems = [
    { label: "Overview", path: "/dashboard", icon: "overview", exact: true },
    { label: "Report an Issue", path: "/dashboard/report", icon: "report" },
    { label: "My Reports", path: "/dashboard/reports", icon: "myReports" },
    { label: "Community Map", path: "/dashboard/map", icon: "map" },
    {
      label: "Notifications",
      path: "/dashboard/notifications",
      icon: "bell",
      badge: unreadCount > 0 ? String(unreadCount) : undefined
    },
    { label: "Community Impact", path: "/dashboard/impact", icon: "impact" }
  ]

  const accountItems = [
    { label: "My Profile", path: "/dashboard/profile", icon: "profile" },
    { label: "Settings", path: "/dashboard/settings", icon: "settings" }
  ]

  const isActive = (item) => {
    if (location.pathname === item.path) return true
    return location.pathname.startsWith(item.path + "/")
  }

  const handleLinkClick = () => {
    if (mobileOpen) {
      setMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="cf-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`cf-sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="cf-sidebar-header">
          <Link to="/dashboard" className="cf-sidebar-brand" onClick={handleLinkClick}>
            <span className="cf-brand-text">CivicFix</span>
            <span className="cf-brand-dot">.</span>
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            className="cf-collapse-toggle desktop-only"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={18} />
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="cf-mobile-close mobile-only"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Civic Tagline / Badge */}
        {!collapsed && (
          <div className="cf-sidebar-tagline-wrap">
            <span className="cf-sidebar-tagline">CITIZEN PORTAL · INDIA</span>
          </div>
        )}

        {/* Navigation Groups */}
        <div className="cf-sidebar-nav-container">
          <div className="cf-nav-group">
            {!collapsed && <span className="cf-nav-group-title">MAIN MENU</span>}
            <nav className="cf-nav-list">
              {navItems.map((item) => {
                const active = isActive(item)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`cf-nav-item ${active ? "active" : ""} ${
                      item.highlight ? "nav-highlight" : ""
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="cf-nav-icon">
                      <Icon name={item.icon} size={20} />
                    </span>
                    {!collapsed && <span className="cf-nav-label">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="cf-nav-badge">{item.badge}</span>
                    )}
                    {collapsed && item.badge && (
                      <span className="cf-nav-badge-dot" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="cf-nav-group">
            {!collapsed && <span className="cf-nav-group-title">PREFERENCES</span>}
            <nav className="cf-nav-list">
              {accountItems.map((item) => {
                const active = isActive(item)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`cf-nav-item ${active ? "active" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="cf-nav-icon">
                      <Icon name={item.icon} size={20} />
                    </span>
                    {!collapsed && <span className="cf-nav-label">{item.label}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with User Card & Logout */}
        <div className="cf-sidebar-footer">
          <div className="cf-sidebar-user-block">
            <div className="cf-sidebar-avatar-wrap">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="cf-sidebar-avatar-img"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="cf-sidebar-avatar-fallback">
                  {(user?.name || "Citizen").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="cf-avatar-online-dot" />
            </div>

            {!collapsed && (
              <div className="cf-sidebar-user-info">
                <span className="cf-sidebar-user-name" title={user?.name}>
                  {user?.name || "Citizen"}
                </span>
                <span className="cf-sidebar-user-email" title={user?.email}>
                  {user?.email || "citizen@civicfix.in"}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="cf-nav-item cf-logout-btn"
            onClick={() => {
              if (mobileOpen) setMobileOpen(false)
              onLogout()
            }}
            title={collapsed ? "Log out" : undefined}
          >
            <span className="cf-nav-icon">
              <Icon name="logout" size={20} />
            </span>
            {!collapsed && <span className="cf-nav-label">Log out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
