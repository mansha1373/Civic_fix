/**
 * CivicFix Frontend Data Service
 * 
 * Provides an encapsulated, modular interface for:
 * - Report management (fetch, create, query by ID, update status)
 * - Notification management (fetch, create, mark read, delete)
 * - User profile management (fetch, update)
 * - Settings & preferences management
 * 
 * ARCHITECTURE / BACKEND READINESS:
 * Each function is designed with async signatures and standard request/response
 * contracts. When transitioning to a production backend (Node.js/Express/MongoDB),
 * these localStorage calls can be swapped for REST API fetch() / axios calls
 * with zero modifications to the UI presentation components.
 */

import { mockReports, mockNotifications, mockCurrentUser } from "../data/mockReports.js"
import api from "./api.js"

const STORAGE_KEYS = {
  REPORTS: "civicfix_custom_reports",
  NOTIFICATIONS: "civicfix_custom_notifications",
  PROFILE: "civicfix_user_profile",
  SETTINGS: "civicfix_user_settings"
}

// ==========================================
// 1. REPORT SERVICE METHODS
// ==========================================

/**
 * Fetch all reports (custom citizen reports from backend MongoDB + regional mock reports)
 */
export async function getReports() {
  try {
    // 1. Try fetching live reports from backend MongoDB
    const res = await api.get("/complaints")
    if (res.data?.success && Array.isArray(res.data.complaints)) {
      const backendComplaints = res.data.complaints
      const backendIds = new Set(backendComplaints.map((r) => r.id))
      const remainingMock = mockReports.filter((r) => !backendIds.has(r.id))
      const merged = [...backendComplaints, ...remainingMock]
      try {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(backendComplaints))
      } catch {
        // quota handled
      }
      return merged
    }
  } catch (err) {
    console.warn("[CivicFix Service] Backend unreachable for complaints, trying local cache:", err.message)
  }

  // 2. Fallback to localStorage cache and mock dataset
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS)
    if (raw) {
      const customReports = JSON.parse(raw)
      if (Array.isArray(customReports)) {
        const customIds = new Set(customReports.map((r) => r.id))
        const remainingMock = mockReports.filter((r) => !customIds.has(r.id))
        return [...customReports, ...remainingMock]
      }
    }
  } catch (err) {
    console.warn("[CivicFix Service] Failed to read reports from storage, falling back to mock dataset:", err)
  }
  return mockReports
}

/**
 * Fetch a specific report by its ticket ID
 */
export async function getReportById(id) {
  try {
    const res = await api.get(`/complaints/${encodeURIComponent(id)}`)
    if (res.data?.success && res.data.complaint) {
      return res.data.complaint
    }
  } catch {
    // Fallback to local list
  }
  const allReports = await getReports()
  return allReports.find((r) => r.id === id) || null
}

/**
 * Create and persist a new civic report via backend MongoDB
 */
export async function createReport(newReport) {
  try {
    let savedReport = newReport

    // 1. Send complaint to Node/Express/MongoDB backend
    try {
      const payload = {
        title: newReport.title,
        description: newReport.description,
        category: newReport.category,
        categoryKey: newReport.categoryKey || "other",
        location: newReport.location,
        coordinates: newReport.coordinates,
        pincode: newReport.pincode || "160017",
        urgency: newReport.urgency || "High",
        images: newReport.images || [],
        image: newReport.image
      }

      const res = await api.post("/complaints", payload)
      if (res.data?.success && res.data.complaint) {
        savedReport = res.data.complaint
      }
    } catch (apiErr) {
      console.warn("[CivicFix Service] Backend API error, using local fallback:", apiErr.message)
    }

    // 2. Cache in localStorage for immediate offline persistence
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS)
      const existing = raw ? JSON.parse(raw) : []
      const updatedCustom = [savedReport, ...existing.filter((r) => r.id !== savedReport.id)]
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updatedCustom))
    } catch (quotaErr) {
      console.warn("[CivicFix Service] LocalStorage quota exceeded:", quotaErr)
    }

    // 3. Automatically generate confirmation notification
    await createNotification({
      id: `notif-auto-${Date.now()}`,
      title: "Complaint Registered Successfully",
      message: `Your complaint #${savedReport.id} (${savedReport.title}) was received and transmitted to ${savedReport.department || "Municipal Wing"}.`,
      time: "Just now",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      read: false,
      type: "submission",
      reportId: savedReport.id
    })

    return { success: true, data: savedReport }
  } catch (err) {
    console.error("[CivicFix Service] Failed to create report:", err)
    return { success: false, error: err.message, data: newReport }
  }
}

/**
 * Update the status and add an administrative note to a report
 */
export async function updateReportStatus(reportId, newStatus, adminRemark = "") {
  try {
    const allReports = await getReports()
    const now = new Date()
    const formattedDate = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

    const updated = allReports.map((r) => {
      if (r.id !== reportId) return r

      const newTimelineStep = {
        stage: newStatus,
        status: newStatus,
        step: `Status Updated to ${newStatus}`,
        date: `${formattedDate}, ${formattedTime}`,
        done: true,
        desc: `Municipal system updated ticket status to ${newStatus}.`,
        adminRemarks: adminRemark || `Status update logged by duty officer.`
      }

      return {
        ...r,
        status: newStatus,
        lastUpdated: formattedDate,
        timeline: [...(r.timeline || []), newTimelineStep]
      }
    })

    const customOnly = updated.filter((r) => r.isUserCreated)
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(customOnly))

    return { success: true, data: updated.find((r) => r.id === reportId) }
  } catch (err) {
    console.error("[CivicFix Service] Failed to update report status:", err)
    return { success: false, error: err.message }
  }
}

// ==========================================
// 2. NOTIFICATION SERVICE METHODS
// ==========================================

/**
 * Fetch all notifications
 */
export async function getNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn("[CivicFix Service] Failed to read notifications from storage:", err)
  }
  return mockNotifications
}

/**
 * Create a new notification
 */
export async function createNotification(notifData) {
  try {
    const existing = await getNotifications()
    const updated = [notifData, ...existing]
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    return { success: true, data: notifData }
  } catch (err) {
    console.error("[CivicFix Service] Failed to create notification:", err)
    return { success: false, error: err.message }
  }
}

/**
 * Mark a specific notification as read or unread
 */
export async function markNotificationRead(notifId, isRead = true) {
  try {
    const existing = await getNotifications()
    const updated = existing.map((n) => (n.id === notifId ? { ...n, read: isRead } : n))
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    return { success: true, data: updated }
  } catch (err) {
    console.error("[CivicFix Service] Failed to toggle notification read state:", err)
    return { success: false, error: err.message }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead() {
  try {
    const existing = await getNotifications()
    const updated = existing.map((n) => ({ ...n, read: true }))
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    return { success: true, data: updated }
  } catch (err) {
    console.error("[CivicFix Service] Failed to mark all notifications read:", err)
    return { success: false, error: err.message }
  }
}

/**
 * Delete a specific notification
 */
export async function deleteNotification(notifId) {
  try {
    const existing = await getNotifications()
    const updated = existing.filter((n) => n.id !== notifId)
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    return { success: true, data: updated }
  } catch (err) {
    console.error("[CivicFix Service] Failed to delete notification:", err)
    return { success: false, error: err.message }
  }
}

// ==========================================
// 3. PROFILE SERVICE METHODS
// ==========================================

/**
 * Fetch citizen profile data
 */
export async function getUserProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...mockCurrentUser, ...parsed }
    }
  } catch (err) {
    console.warn("[CivicFix Service] Failed to read profile from storage:", err)
  }
  return mockCurrentUser
}

/**
 * Update citizen profile data
 */
export async function updateUserProfile(profileUpdates) {
  try {
    const current = await getUserProfile()
    const merged = { ...current, ...profileUpdates }
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(merged))
    return { success: true, data: merged }
  } catch (err) {
    console.error("[CivicFix Service] Failed to save profile:", err)
    return { success: false, error: err.message }
  }
}

// ==========================================
// 4. SETTINGS SERVICE METHODS
// ==========================================

const DEFAULT_SETTINGS = {
  emailAlerts: true,
  inAppAlerts: true,
  smsUpdates: true,
  weeklyDigest: false,
  language: "en",
  publicVisibility: true
}

/**
 * Fetch settings and notification preferences
 */
export async function getUserSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (err) {
    console.warn("[CivicFix Service] Failed to read settings from storage:", err)
  }
  return DEFAULT_SETTINGS
}

/**
 * Update settings and notification preferences
 */
export async function updateUserSettings(settingsUpdates) {
  try {
    const current = await getUserSettings()
    const merged = { ...current, ...settingsUpdates }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged))
    return { success: true, data: merged }
  } catch (err) {
    console.error("[CivicFix Service] Failed to save settings:", err)
    return { success: false, error: err.message }
  }
}
