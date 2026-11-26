import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

// Ensure environment variables are loaded
dotenv.config()

// Validate that required credentials exist
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    "[Cloudinary Config Warning] Missing Cloudinary credentials in environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)."
  )
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
})

export default cloudinary
