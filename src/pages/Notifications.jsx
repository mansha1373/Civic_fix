import React, { useState } from "react"
import { Link, useOutletContext } from "react-router-dom"
import { Icon } from "../components/dashboard/Icons.jsx"

export default function Notifications() {
  const {
    notifications = [],
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    unreadCount = 0,
    loadingNotifs
  } = useOutletContext() || {}

  const [filter, setFilter] = useState("all")

  const handleMarkAllRead = () => {
    if (markAllNotificationsRead) {
      markAllNotificationsRead()
    }
  }

  const handleItemRead = (id) => {
    if (markNotificationRead) {
      markNotificationRead(id, true)
    }
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (deleteNotification) {
      deleteNotification(id)
    }
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
            Official progress updates, officer dispatches, and work orders on your reported issues.
          </p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="cf-button" onClick={handleMarkAllRead}>
            <Icon name="check" size={16} />
            <span>Mark All as Read ({unreadCount})</span>
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
        {loadingNotifs ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#695154" }}>
            <p>Loading notifications from MongoDB Atlas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="cf-empty-state-card" style={{
            backgroundColor: "#FFFFFF",
            border: "1px dashed #EAE3D5",
            borderRadius: "1.25rem",
            padding: "48px 24px",
            textAlign: "center"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#FFF9EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#59343B"
            }}>
              <Icon name="bell" size={24} color="#59343B" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#281719", marginBottom: "6px" }}>
              No Notifications Yet
            </h3>
            <p style={{ fontSize: "13px", color: "#695154", maxWidth: "380px", margin: "0 auto" }}>
              You will receive automatic alerts here when you submit a complaint or when municipal officers update its status.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id || item._id}
              className={`cf-notif-full-card ${item.read ? "read" : "unread"}`}
              onClick={() => handleItemRead(item.id || item._id)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <div className="cf-notif-full-icon">{getNotifIcon(item.type)}</div>
              <div className="cf-notif-full-body">
                <div className="cf-notif-full-header">
                  <strong className="cf-notif-title">{item.title}</strong>
                  <span className="cf-notif-time">{item.time || item.date}</span>
                </div>
                <p className="cf-notif-desc">{item.message}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
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
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id || item._id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#A1888B",
                      fontSize: "11px",
                      cursor: "pointer",
                      padding: "4px"
                    }}
                    title="Dismiss notification"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              {!item.read && <span className="cf-notif-unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
