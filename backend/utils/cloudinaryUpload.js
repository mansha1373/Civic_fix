import cloudinary from "../config/cloudinary.js"
import { Readable } from "stream"

/**
 * Upload an in-memory file buffer directly to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer from Multer memoryStorage
 * @param {Object} options - Cloudinary upload options (folder, transformations, tags)
 * @returns {Promise<{ secure_url: string, public_id: string, format: string, bytes: number, width: number, height: number }>}
 */
export async function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error("Invalid buffer provided for Cloudinary upload"))
    }

    const defaultOptions = {
      folder: "civicfix/complaints",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "heic", "heif"],
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ],
      ...options
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      }
    )

    const readable = new Readable()
    readable._read = () => {}
    readable.push(buffer)
    readable.push(null)
    readable.pipe(uploadStream)
  })
}

/**
 * Remove an asset from Cloudinary by its public ID
 * @param {string} publicId
 * @returns {Promise<any>}
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return null
  return cloudinary.uploader.destroy(publicId)
}
