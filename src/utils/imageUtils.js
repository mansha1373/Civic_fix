/**
 * Image handling and optimization utilities for CivicFix
 * Supports validation, preview generation via Object URLs,
 * and lightweight canvas thumbnail compression for localStorage persistence.
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

/**
 * Format raw bytes into human-readable string (KB/MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Validates an image file for CivicFix reporting
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: "No file provided" }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported format (${file.type || "unknown"}). Please upload JPG, PNG, or WebP.`
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds 10MB limit (${formatBytes(file.size)}).`
    }
  }

  return { valid: true }
}

/**
 * Creates an object URL for instant, high-res browser preview
 * @param {File} file
 * @returns {string} objectUrl
 */
export function createPreviewUrl(file) {
  return URL.createObjectURL(file)
}

/**
 * Revokes an object URL to prevent memory leaks
 * @param {string} url
 */
export function revokePreviewUrl(url) {
  if (url && typeof url === "string" && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }
}

/**
 * Compresses an image file to a lightweight data URL using an offscreen canvas.
 * This allows newly filed complaint photos to safely persist in localStorage
 * without exceeding the browser's 5MB storage quota.
 *
 * @param {File} file
 * @param {number} maxWidth
 * @param {number} quality
 * @returns {Promise<string>} Base64 data URL
 */
export function compressImageForStorage(file, maxWidth = 640, quality = 0.72) {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          let width = img.width
          let height = img.height

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, width, height)

          const dataUrl = canvas.toDataURL("image/jpeg", quality)
          resolve(dataUrl)
        }
        img.onerror = () => {
          // Fallback to placeholder if canvas read fails
          resolve("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80")
        }
        img.src = event.target.result
      }
      reader.onerror = () => {
        resolve("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80")
      }
      reader.readAsDataURL(file)
    } catch {
      resolve("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80")
    }
  })
}
