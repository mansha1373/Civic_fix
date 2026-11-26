/**
 * CivicFix Frontend Data Service
 * 
 * Provides an authenticated, modular interface for:
 * - Complaint management (fetch my complaints, community complaints, query by ID, submit report)
 * - Notification management (fetch real events, mark read, mark all read, delete)
 * - User profile management (fetch live profile from MongoDB, update permitted fields)
 * - User settings management (persist notification & account preferences in MongoDB Atlas)
 * - Statistics & Community Impact (real database aggregation)
 */

import api from "./api.js"

// ==========================================
// 1. COMPLAINT SERVICE METHODS
// ==========================================

/**
 * Fetch reports submitted strictly by the authenticated citizen
 */
export async function getReports() {
  try {
    const res = await api.get("/complaints/my")
    if (res.data?.success && Array.isArray(res.data.complaints)) {
      return res.data.complaints
    }
    return []
  } catch (err) {
    console.error("[CivicFix Service] Failed to fetch citizen reports:", err.message)
    throw err
  }
}

/**
 * Fetch all community reports for public community map and regional exploration
 */
export async function getCommunityReports() {
  try {
    const res = await api.get("/complaints")
    if (res.data?.success && Array.isArray(res.data.complaints)) {
      return res.data.complaints
    }
    return []
  } catch (err) {
    console.error("[CivicFix Service] Failed to fetch community reports:", err.message)
    return []
  }
}

/**
 * Fetch aggregated statistics from MongoDB (both user-specific and community-wide)
 */
export async function getComplaintStats() {
  try {
    const res = await api.get("/complaints/stats")
    if (res.data?.success) {
      return {
        userStats: res.data.userStats,
        communityStats: res.data.communityStats
      }
    }
    return null
  } catch (err) {
    console.error("[CivicFix Service] Failed to fetch complaint statistics:", err.message)
    return null
  }
}

/**
 * Fetch a specific complaint by ticket ID or MongoDB _id
 */
export async function getReportById(id) {
  try {
    const res = await api.get(`/complaints/${encodeURIComponent(id)}`)
    if (res.data?.success && res.data.complaint) {
      return res.data.complaint
    }
    throw new Error(res.data?.message || `No complaint found with ID "${id}"`)
  } catch (err) {
    console.error(`[CivicFix Service] Error retrieving report #${id}:`, err.message)
    throw err
  }
}

/**
 * Upload a single photo directly to Cloudinary via backend SDK
 */
export async function uploadImageToCloudinary(file) {
  const formData = new FormData()
  formData.append("image", file)
  const res = await api.post("/complaints/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return res.data
}

/**
 * Create and persist a new civic complaint in MongoDB Atlas with Cloudinary images
 */
export async function createReport(newReport) {
  try {
    let res
    if (newReport.rawFiles && Array.isArray(newReport.rawFiles) && newReport.rawFiles.length > 0) {
      const formData = new FormData()
      formData.append("title", newReport.title)
      formData.append("description", newReport.description)
      formData.append("category", newReport.category)
      formData.append("categoryKey", newReport.categoryKey || "other")
      formData.append("location", newReport.location)
      formData.append("coordinates", JSON.stringify(newReport.coordinates || { lat: 30.7415, lng: 76.7794 }))
      formData.append("pincode", newReport.pincode || "160017")
      formData.append("urgency", newReport.urgency || "High")

      // Attach file buffers under "photos" field
      newReport.rawFiles.forEach((file) => {
        formData.append("photos", file)
      })

      if (newReport.image) {
        formData.append("image", newReport.image)
      }

      res = await api.post("/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    } else {
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

      res = await api.post("/complaints", payload)
    }

    if (res.data?.success && res.data.complaint) {
      return { success: true, data: res.data.complaint }
    }
    throw new Error(res.data?.message || "Failed to create complaint")
  } catch (err) {
    console.error("[CivicFix Service] Failed to create report:", err)
    return {
      success: false,
      error: err.response?.data?.message || err.message || "Complaint submission failed"
    }
  }
}

// ==========================================
// 2. NOTIFICATION SERVICE METHODS (MONGODB)
// ==========================================

/**
 * Fetch live notifications from MongoDB for the authenticated citizen
 */
export async function getNotifications() {
  try {
    const res = await api.get("/notifications")
    if (res.data?.success && Array.isArray(res.data.notifications)) {
      return res.data.notifications
    }
    return []
  } catch (err) {
    console.error("[CivicFix Service] Failed to load notifications:", err.message)
    return []
  }
}

/**
 * Mark a specific notification as read in MongoDB
 */
export async function markNotificationRead(notifId, isRead = true) {
  try {
    const res = await api.patch(`/notifications/${notifId}/read`, { read: isRead })
    return { success: true, data: res.data?.notification }
  } catch (err) {
    console.error("[CivicFix Service] Failed to update notification read status:", err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Mark all notifications as read in MongoDB
 */
export async function markAllNotificationsRead() {
  try {
    const res = await api.patch("/notifications/read-all")
    return { success: true, message: res.data?.message }
  } catch (err) {
    console.error("[CivicFix Service] Failed to mark all notifications read:", err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Delete a notification from MongoDB
 */
export async function deleteNotification(notifId) {
  try {
    const res = await api.delete(`/notifications/${notifId}`)
    return { success: true, message: res.data?.message }
  } catch (err) {
    console.error("[CivicFix Service] Failed to delete notification:", err.message)
    return { success: false, error: err.message }
  }
}

// ==========================================
// 3. PROFILE SERVICE METHODS (MONGODB)
// ==========================================

/**
 * Fetch citizen profile data from MongoDB
 */
export async function getUserProfile() {
  try {
    const res = await api.get("/auth/me")
    if (res.data?.success && res.data.user) {
      return res.data.user
    }
    return null
  } catch (err) {
    console.error("[CivicFix Service] Failed to fetch citizen profile:", err.message)
    return null
  }
}

/**
 * Update citizen profile in MongoDB Atlas
 */
export async function updateUserProfile(profileUpdates) {
  try {
    const res = await api.put("/auth/profile", profileUpdates)
    if (res.data?.success && res.data.user) {
      return { success: true, data: res.data.user }
    }
    throw new Error(res.data?.message || "Profile update failed")
  } catch (err) {
    console.error("[CivicFix Service] Failed to save profile to MongoDB:", err.message)
    return { success: false, error: err.message }
  }
}

// ==========================================
// 4. SETTINGS SERVICE METHODS (MONGODB)
// ==========================================

const DEFAULT_SETTINGS = {
  emailAlerts: true,
  smsUpdates: true,
  weeklyDigest: false,
  language: "en",
  locationPrivacy: true
}

/**
 * Fetch settings and notification preferences from MongoDB
 */
export async function getUserSettings() {
  try {
    const res = await api.get("/auth/me")
    if (res.data?.success && res.data.user?.settings) {
      return { ...DEFAULT_SETTINGS, ...res.data.user.settings }
    }
    return DEFAULT_SETTINGS
  } catch (err) {
    console.error("[CivicFix Service] Failed to read settings from backend:", err.message)
    return DEFAULT_SETTINGS
  }
}

/**
 * Update settings and notification preferences in MongoDB Atlas
 */
export async function updateUserSettings(settingsUpdates) {
  try {
    const res = await api.put("/auth/settings", settingsUpdates)
    if (res.data?.success && res.data.settings) {
      return { success: true, data: res.data.settings }
    }
    throw new Error(res.data?.message || "Settings update failed")
  } catch (err) {
    console.error("[CivicFix Service] Failed to save settings to MongoDB:", err.message)
    return { success: false, error: err.message }
  }
}
