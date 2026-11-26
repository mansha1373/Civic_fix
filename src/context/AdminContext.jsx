import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../auth/AuthContext.jsx"
import api from "../services/api.js"
import { INITIAL_DEPARTMENTS } from "../data/mockData.js"

const AdminContext = createContext(null)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

export function AdminProvider({ children }) {
  const auth = useAuth()
  const authUser = auth?.user

  // Real Database States from MongoDB Atlas
  const [complaints, setComplaints] = useState([])
  const [citizens, setCitizens] = useState([])
  const [notifications, setNotifications] = useState([])
  const [backendStats, setBackendStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // System Settings State
  const [settings, setSettings] = useState({
    adminProfile: {
      name: "Dr. Vandana Rao",
      email: "admin.vandana@civicfix.gov",
      phone: "+91 172 274000",
      title: "Senior Municipal Administrator",
      department: "Municipal Corporation Administration",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      bio: "Overseeing public grievance resolution and inter-departmental SLA compliance."
    },
    notifications: {
      emailCritical: true,
      smsUrgent: true,
      dailyDigest: true,
      soundAlerts: false
    }
  })

  // Toast / notification banner state
  const [toasts, setToasts] = useState([])

  const addToast = (type, title, message) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // --- Backend Data Fetchers ---
  const fetchComplaints = useCallback(async () => {
    try {
      const res = await api.get("/complaints")
      if (res.data?.success && Array.isArray(res.data.complaints)) {
        setComplaints(res.data.complaints)
      }
    } catch (err) {
      console.error("[AdminContext] Failed to fetch complaints:", err.message)
    }
  }, [])

  const fetchCitizens = useCallback(async () => {
    try {
      const res = await api.get("/admin/citizens")
      if (res.data?.success && Array.isArray(res.data.citizens)) {
        setCitizens(res.data.citizens)
      }
    } catch (err) {
      console.error("[AdminContext] Failed to fetch citizens:", err.message)
    }
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/admin/notifications")
      if (res.data?.success && Array.isArray(res.data.notifications)) {
        setNotifications(res.data.notifications)
      }
    } catch (err) {
      console.error("[AdminContext] Failed to fetch admin notifications:", err.message)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/admin/stats")
      if (res.data?.success) {
        setBackendStats(res.data)
      }
    } catch (err) {
      console.error("[AdminContext] Failed to fetch admin stats:", err.message)
    }
  }, [])

  // Load all admin data on mount or when admin session changes
  const refreshAll = useCallback(async () => {
    setLoading(true)
    await Promise.all([
      fetchComplaints(),
      fetchCitizens(),
      fetchNotifications(),
      fetchStats()
    ])
    setLoading(false)
  }, [fetchComplaints, fetchCitizens, fetchNotifications, fetchStats])

  useEffect(() => {
    if (authUser?.role === "admin") {
      refreshAll()
    }
  }, [authUser?.role, refreshAll])

  // Current logged-in admin user
  const currentUser = useMemo(() => {
    if (authUser && authUser.role === "admin") {
      return {
        ...settings.adminProfile,
        name: authUser.name || settings.adminProfile.name,
        email: authUser.email || settings.adminProfile.email,
        phone: authUser.phone || settings.adminProfile.phone,
        id: authUser.id || authUser._id || "ADM-01",
        role: "admin"
      }
    }
    return {
      ...settings.adminProfile,
      id: "ADM-01",
      role: "admin"
    }
  }, [authUser, settings.adminProfile])

  // Real-time Calculated Statistics
  const stats = useMemo(() => {
    const total = complaints.length
    const pending = complaints.filter(
      (c) => c.status === "Pending" || c.status === "Submitted"
    ).length
    const inProgress = complaints.filter((c) => c.status === "In Progress").length
    const resolved = complaints.filter((c) => c.status === "Resolved").length
    const rejected = complaints.filter((c) => c.status === "Rejected").length
    const unreadNotifications = notifications.filter((n) => !n.read).length

    return {
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      unreadNotifications,
      totalCitizens: citizens.length,
      resolutionRate: total > 0 ? `${((resolved / total) * 100).toFixed(1)}%` : "0.0%"
    }
  }, [complaints, notifications, citizens])

  // Dynamic Department Metrics aggregated from real complaints in MongoDB
  const departments = useMemo(() => {
    return INITIAL_DEPARTMENTS.map((dept) => {
      const deptComplaints = complaints.filter(
        (c) =>
          c.department?.toLowerCase().includes(dept.name.toLowerCase().split(" ")[0]) ||
          c.category?.toLowerCase().includes(dept.name.toLowerCase().split(" ")[0])
      )
      const assigned = deptComplaints.length
      const resolved = deptComplaints.filter((c) => c.status === "Resolved").length
      const pending = assigned - resolved

      return {
        ...dept,
        assignedComplaints: assigned,
        resolvedComplaints: resolved,
        pendingComplaints: pending
      }
    })
  }, [complaints])

  // --- Complaint Status Actions (Connected to MongoDB Atlas) ---
  const updateComplaintStatus = async (complaintId, newStatus, remarks = "", assignedOfficer = "") => {
    try {
      const res = await api.patch(`/complaints/${complaintId}/status`, {
        status: newStatus,
        remarks,
        assignedOfficer
      })

      if (res.data?.success && res.data.complaint) {
        const updated = res.data.complaint
        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId || c.complaintId === complaintId ? updated : c))
        )
        // Refresh notifications & stats
        fetchNotifications()
        fetchStats()
        addToast("success", `Status Updated: ${newStatus}`, `Ticket #${complaintId} marked ${newStatus}.`)
        return { success: true, complaint: updated }
      }
      throw new Error(res.data?.message || "Failed to update status")
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update complaint status"
      addToast("error", "Status Update Failed", errMsg)
      return { success: false, error: errMsg }
    }
  }

  const approveComplaint = async (complaintId) => {
    return await updateComplaintStatus(
      complaintId,
      "In Progress",
      "Approved and field operations team dispatched by Municipal Administration."
    )
  }

  const markResolved = async (complaintId, resolutionRemarks = "") => {
    return await updateComplaintStatus(
      complaintId,
      "Resolved",
      resolutionRemarks || "Resolved via Administrative Console with photographic inspection sign-off."
    )
  }

  const addComplaint = async (newComplaintData) => {
    try {
      const res = await api.post("/complaints", {
        title: newComplaintData.title,
        description: newComplaintData.description || "Administrative emergency ticket logged via Control Center.",
        category: newComplaintData.category || "Roads and Infrastructure",
        location: newComplaintData.location?.address || newComplaintData.location || "Sector 17, Chandigarh",
        coordinates: newComplaintData.coordinates || { lat: 30.7415, lng: 76.7794 },
        urgency: newComplaintData.priority || "High",
        images: newComplaintData.image ? [newComplaintData.image] : []
      })

      if (res.data?.success && res.data.complaint) {
        const created = res.data.complaint
        setComplaints((prev) => [created, ...prev])
        fetchStats()
        fetchNotifications()
        addToast("success", "Complaint Registered", `New ticket #${created.id} saved in MongoDB Atlas.`)
        return created
      }
    } catch (err) {
      addToast("error", "Registration Failed", err.message)
    }
  }

  // --- Citizen Actions ---
  const toggleCitizenStatus = (citizenId) => {
    setCitizens((prev) =>
      prev.map((c) => {
        if (c.id === citizenId) {
          const nextStatus = c.status === "Active" ? "Suspended" : "Active"
          return { ...c, status: nextStatus }
        }
        return c
      })
    )
    addToast("info", "Citizen Status Toggled", `Account status updated.`)
  }

  const addCitizen = async (citizenData) => {
    try {
      const res = await api.post("/auth/register", {
        name: citizenData.name,
        email: citizenData.email,
        password: "Citizen@12345"
      })
      if (res.data?.success) {
        fetchCitizens()
        addToast("success", "Citizen Registered", `${citizenData.name} account created in MongoDB.`)
      }
    } catch (err) {
      addToast("error", "Citizen Registration Failed", err.message)
    }
  }

  // --- Notification Actions (Connected to MongoDB Atlas) ---
  const markNotificationRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n))
    )
    try {
      await api.patch(`/admin/notifications/${id}/read`)
    } catch (err) {
      console.error("Failed to mark admin notification read:", err)
    }
  }

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await api.patch("/admin/notifications/read-all")
    } catch (err) {
      console.error("Failed to mark all admin notifications read:", err)
    }
  }

  const deleteNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id))
    try {
      await api.delete(`/admin/notifications/${id}`)
    } catch (err) {
      console.error("Failed to delete admin notification:", err)
    }
  }

  const clearAllNotifications = async () => {
    await markAllNotificationsRead()
  }

  // --- Settings & Profile Actions (Connected to MongoDB Atlas) ---
  const updateProfile = async (newProfile) => {
    try {
      const res = await api.put("/auth/profile", newProfile)
      if (res.data?.success && res.data.user) {
        setSettings((prev) => ({
          ...prev,
          adminProfile: { ...prev.adminProfile, ...newProfile }
        }))
        addToast("success", "Profile Saved", "Admin profile saved to MongoDB Atlas.")
      }
    } catch (err) {
      addToast("error", "Profile Update Failed", err.message)
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      await api.put("/auth/settings", newSettings)
      setSettings((prev) => ({ ...prev, ...newSettings }))
      addToast("success", "Settings Saved", "System preferences saved to MongoDB Atlas.")
    } catch (err) {
      addToast("error", "Settings Update Failed", err.message)
    }
  }

  const resetAllData = () => {
    refreshAll()
    addToast("info", "Data Refreshed", "Synchronized live data with MongoDB Atlas.")
  }

  const login = async (email, password) => {
    if (auth?.adminLogin) {
      return await auth.adminLogin(email, password)
    }
  }

  const logout = async () => {
    if (auth?.logout) {
      await auth.logout()
    }
  }

  const value = {
    complaints,
    departments,
    citizens,
    notifications,
    settings,
    currentUser,
    stats,
    backendStats,
    loading,
    toasts,
    refreshAll,
    fetchComplaints,
    fetchCitizens,
    fetchNotifications,
    fetchStats,
    updateComplaintStatus,
    approveComplaint,
    markResolved,
    addComplaint,
    addCitizen,
    toggleCitizenStatus,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    updateProfile,
    resetAllData,
    addToast,
    login,
    logout
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export default AdminContext
