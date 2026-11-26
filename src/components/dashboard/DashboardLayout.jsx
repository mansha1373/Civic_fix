import React, { useState, useEffect, useCallback } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext.jsx"
import { useWaveNavigate } from "../TransitionProvider.jsx"
import Sidebar from "./Sidebar.jsx"
import Topbar from "./Topbar.jsx"
import {
  getReports,
  createReport,
  getNotifications,
  markNotificationRead as serviceMarkRead,
  markAllNotificationsRead as serviceMarkAllRead,
  deleteNotification as serviceDeleteNotif,
  updateUserProfile as serviceUpdateProfile,
  getUserProfile
} from "../../services/civicfixService.js"

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const waveNavigate = useWaveNavigate()
  const normalNavigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Genuine state directly fetched from MongoDB Atlas (initial empty arrays)
  const [reports, setReports] = useState([])
  const [notifications, setNotifications] = useState([])
  const [profileData, setProfileData] = useState({})
  const [loadingReports, setLoadingReports] = useState(true)
  const [loadingNotifs, setLoadingNotifs] = useState(true)

  // Fetch citizen reports from MongoDB
  const fetchReports = useCallback(async () => {
    try {
      setLoadingReports(true)
      const data = await getReports()
      setReports(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("[Dashboard] Failed to fetch complaints:", err.message)
      setReports([])
    } finally {
      setLoadingReports(false)
    }
  }, [])

  // Fetch citizen notifications from MongoDB
  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifs(true)
      const notifs = await getNotifications()
      setNotifications(Array.isArray(notifs) ? notifs : [])
    } catch (err) {
      console.error("[Dashboard] Failed to fetch notifications:", err.message)
      setNotifications([])
    } finally {
      setLoadingNotifs(false)
    }
  }, [])

  // Fetch live citizen profile from MongoDB
  const fetchProfile = useCallback(async () => {
    try {
      const liveUser = await getUserProfile()
      if (liveUser) {
        setProfileData(liveUser)
      }
    } catch {
      // User from AuthContext serves as immediate baseline
    }
  }, [])

  useEffect(() => {
    fetchReports()
    fetchNotifications()
    fetchProfile()
  }, [fetchReports, fetchNotifications, fetchProfile])

  // Profile update handler connected to MongoDB
  const updateProfile = async (updatedFields) => {
    const res = await serviceUpdateProfile(updatedFields)
    if (res?.success && res.data) {
      setProfileData(res.data)
      return res.data
    }
    return null
  }

  // Active citizen profile dynamically populated from verified MongoDB session
  const activeUser = {
    ...profileData,
    ...(user || {}),
    name: profileData?.name || user?.name || "Citizen",
    email: user?.email || profileData?.email || "",
    phone: profileData?.phone || user?.phone || "+91 98765 43210",
    city: profileData?.city || user?.city || "Chandigarh",
    sector: profileData?.sector || user?.sector || "Sector 17",
    ward: profileData?.ward || user?.ward || "Ward No. 4, MCC",
    bio: profileData?.bio || user?.bio || "Active resident passionate about neighbourhood improvements and civic maintenance."
  }

  const handleLogout = () => {
    logout()
    if (typeof waveNavigate === "function") {
      waveNavigate("/")
    } else {
      normalNavigate("/")
    }
  }

  // Submit report to MongoDB and reload live data
  const addReport = async (newReport) => {
    const res = await createReport(newReport)
    if (res?.success && res.data) {
      // Refresh both reports and notifications immediately from MongoDB
      await fetchReports()
      await fetchNotifications()
      return res.data
    }
    throw new Error(res?.error || "Failed to submit report")
  }

  // Notification management handlers
  const deleteNotification = async (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId && n._id !== notifId))
    await serviceDeleteNotif(notifId)
  }

  const markNotificationRead = async (notifId, isRead = true) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId || n._id === notifId ? { ...n, read: isRead } : n))
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
              setReports,
              fetchReports,
              loadingReports,
              addReport,
              notifications,
              setNotifications,
              fetchNotifications,
              loadingNotifs,
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
