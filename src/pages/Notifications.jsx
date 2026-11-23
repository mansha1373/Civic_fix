import React, { useState } from "react"
import { Link, useOutletContext } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"
import { mockNotifications } from "../data/mockReports.js"

export default function Notifications() {
  const context = useOutletContext() || {}
  const [localNotifications, setLocalNotifications] = useState(mockNotifications)

  const notifications = context.notifications || localNotifications
  const setNotifications = context.setNotifications || setLocalNotifications
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markItemRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read
    if (filter === "progress") return n.type === "progress" || n.type === "review"
    if (filter === "resolved") return n.type === "resolved"
    return true
  })

  const getNotifIcon = (type) => {
    switch (type) {
      case "resolved":
        return <Icon name="checkCircle" size={20} color="#15803D" />
      case "progress":
        return <Icon name="tool" size={20} color="#1D4ED8" />
      case "review":
        return <Icon name="clock" size={20} color="#B45309" />
      default:
        return <Icon name="bell" size={20} color="#59343B" />
    }
  }

  return (
    <div className="cf-page-container">
      <div className="cf-page-header">
        <div>
          <span className="cf-pill">ACTIVITY STREAM</span>
          <h1 className="cf-page-title">Notifications</h1>
          <p className="cf-page-subtitle">
            Official progress updates, officer dispatches, and community votes on your issues.
          </p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="cf-button" onClick={markAllRead}>
            <Icon name="check" size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="cf-filters-toolbar">
        <div className="cf-filter-tabs">
          <button
            type="button"
            className={`cf-filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Updates ({notifications.length})
          </button>
          <button
            type="button"
            className={`cf-filter-tab ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={`cf-filter-tab ${filter === "progress" ? "active" : ""}`}
            onClick={() => setFilter("progress")}
          >
            Work in Progress
          </button>
          <button
            type="button"
            className={`cf-filter-tab ${filter === "resolved" ? "active" : ""}`}
            onClick={() => setFilter("resolved")}
          >
            Resolved Fixes
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="cf-notif-page-list">
        {filtered.length === 0 ? (
          <div className="cf-empty-state-card">
            <Icon name="bell" size={32} color="#59343B" />
            <h3>No notifications here</h3>
            <p>You're all caught up with your civic updates.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`cf-notif-full-card ${item.read ? "read" : "unread"}`}
              onClick={() => markItemRead(item.id)}
            >
              <div className="cf-notif-full-icon">{getNotifIcon(item.type)}</div>
              <div className="cf-notif-full-body">
                <div className="cf-notif-full-header">
                  <strong className="cf-notif-title">{item.title}</strong>
                  <span className="cf-notif-time">{item.time}</span>
                </div>
                <p className="cf-notif-desc">{item.message}</p>
                {item.reportId && (
                  <Link
                    to={`/dashboard/reports/${item.reportId}`}
                    className="cf-notif-track-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>View Ticket {item.reportId}</span>
                    <Icon name="arrowRight" size={13} />
                  </Link>
                )}
              </div>
              {!item.read && <span className="cf-notif-unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
