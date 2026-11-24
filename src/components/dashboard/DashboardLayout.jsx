import React, { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext.jsx"
import { useWaveNavigate } from "../TransitionProvider.jsx"
import Sidebar from "./Sidebar.jsx"
import Topbar from "./Topbar.jsx"
import { mockCurrentUser, mockReports, mockNotifications } from "../../data/mockReports.js"
import {
  getReports,
  createReport,
  createNotification,
  markNotificationRead as serviceMarkRead,
  markAllNotificationsRead as serviceMarkAllRead,
  deleteNotification as serviceDeleteNotif,
  updateUserProfile as serviceUpdateProfile
} from "../../services/civicfixService.js"

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const waveNavigate = useWaveNavigate()
  const normalNavigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // State for user reports to allow adding new issues dynamically and persisting to localStorage
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem("civicfix_custom_reports")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const customIds = new Set(parsed.map((r) => r.id))
          const remainingMock = mockReports.filter((r) => !customIds.has(r.id))
          return [...parsed, ...remainingMock]
        }
      }
    } catch {
      // fallback
    }
    return mockReports
  })

  // State for notifications to reflect newly filed issues in real-time
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("civicfix_custom_notifications")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // fallback
    }
    return mockNotifications
  })

  // State for user profile with localStorage persistence
  const [profileData, setProfileData] = useState(() => {
    try {
      const userKey = user?.email ? `civicfix_profile_${user.email.toLowerCase()}` : "civicfix_user_profile"
      const saved = localStorage.getItem(userKey)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // fallback
    }
    return {}
  })

  // Synchronize profile data whenever the authenticated user changes
  useEffect(() => {
    if (user?.email) {
      try {
        const userKey = `civicfix_profile_${user.email.toLowerCase()}`
        const saved = localStorage.getItem(userKey)
        if (saved) {
          setProfileData(JSON.parse(saved))
        } else {
          setProfileData({})
        }
      } catch {
        setProfileData({})
      }
    }
  }, [user?.email])

  const updateProfile = async (updatedFields) => {
    const merged = { ...profileData, ...updatedFields }
    setProfileData(merged)
    if (user?.email) {
      const userKey = `civicfix_profile_${user.email.toLowerCase()}`
      localStorage.setItem(userKey, JSON.stringify(merged))
    }
    localStorage.setItem("civicfix_user_profile", JSON.stringify(merged))
    await serviceUpdateProfile(updatedFields)
  }

  // Active citizen profile dynamically merged:
  // Base template -> profile edits -> authenticated user (name, email ALWAYS strictly from login)
  const activeUser = {
    ...mockCurrentUser,
    ...profileData,
    ...(user || {}),
    name: user?.name || profileData?.name || "Citizen",
    email: user?.email || profileData?.email || "citizen@civicfix.in"
  }

  // Synchronize reports from backend on mount
  useEffect(() => {
    let isMounted = true
    getReports()
      .then((liveReports) => {
        if (isMounted && Array.isArray(liveReports) && liveReports.length > 0) {
          setReports(liveReports)
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = () => {
    logout()
    if (typeof waveNavigate === "function") {
      waveNavigate("/")
    } else {
      normalNavigate("/")
    }
  }

  const addReport = async (newReport) => {
    // Call service to persist to backend MongoDB
    const res = await createReport(newReport)
    const savedReport = res?.data || newReport

    setReports((prev) => [savedReport, ...prev.filter((r) => r.id !== savedReport.id)])

    // Also update notification state in memory
    const autoNotif = {
      id: `notif-auto-${Date.now()}`,
      title: "Complaint Registered Successfully",
      message: `Your complaint #${savedReport.id} (${savedReport.title}) was received and transmitted to ${savedReport.department || "Municipal Wing"}.`,
      time: "Just now",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      read: false,
      type: "submission",
      reportId: savedReport.id
    }
    setNotifications((prev) => [autoNotif, ...prev])
    return savedReport
  }

  const addNotification = async (newNotif) => {
    setNotifications((prev) => [newNotif, ...prev])
    await createNotification(newNotif)
  }

  const deleteNotification = async (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId))
    await serviceDeleteNotif(notifId)
  }

  const markNotificationRead = async (notifId, isRead = true) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: isRead } : n))
    )
    await serviceMarkRead(notifId, isRead)
  }

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await serviceMarkAllRead()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className={`cf-dashboard-root ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Persistent Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={activeUser}
        unreadCount={unreadCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="cf-dashboard-wrapper">
        <Topbar
          user={activeUser}
          unreadCount={unreadCount}
          notifications={notifications}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="cf-dashboard-main">
          <Outlet
            context={{
              user: activeUser,
              profileData,
              updateProfile,
              reports,
              addReport,
              notifications,
              setNotifications,
              addNotification,
              deleteNotification,
              markNotificationRead,
              markAllNotificationsRead,
              unreadCount,
              searchQuery,
              setSearchQuery
            }}
          />
        </main>
      </div>
    </div>
  )
}
