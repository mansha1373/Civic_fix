import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({ path: "./backend/.env" })
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/authRoutes.js"
import complaintRoutes from "../routes/complaintRoutes.js"
import { notFound, errorHandler } from "../middleware/errorMiddleware.js"
import Complaint from "../models/Complaint.js"
import User from "../models/User.js"
import { connectDB } from "../config/db.js"
import cloudinary from "../config/cloudinary.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js"

let server
let baseUrl
let testToken = ""
let testUserId = ""
let createdComplaintDocId = ""
let uploadedPublicIds = []

// Minimal 1x1 transparent PNG buffer for testing real image uploads
const SAMPLE_PNG_BUFFER = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
)

async function runCloudinaryTests() {
  console.log("==================================================")
  console.log("CIVICFIX: CLOUDINARY & MULTER VERIFICATION SUITE")
  console.log("==================================================\n")

  try {
    // 1. Check environment variables
    console.log("[1/7] Inspecting Cloudinary environment configuration...")
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName) throw new Error("CLOUDINARY_CLOUD_NAME is not set in environment.")
    if (!apiKey) throw new Error("CLOUDINARY_API_KEY is not set in environment.")
    if (!apiSecret) throw new Error("CLOUDINARY_API_SECRET is not set in environment.")

    console.log(`✔ CLOUDINARY_CLOUD_NAME detected: ${cloudName}`)
    console.log(`✔ CLOUDINARY_API_KEY detected: ${apiKey.slice(0, 4)}****`)
    console.log(`✔ CLOUDINARY_API_SECRET detected: [EXISTS - LENGTH: ${apiSecret.length} CHARS - REDACTED]`)

    // 2. Ping Cloudinary API directly
    console.log("\n[2/7] Testing direct Cloudinary API connectivity...")
    const pingResult = await cloudinary.api.ping()
    if (pingResult.status !== "ok") {
      throw new Error(`Cloudinary ping returned status: ${pingResult.status}`)
    }
    console.log("✔ Cloudinary API Ping successful (status: 'ok').")

    // 3. Test direct buffer upload with uploadToCloudinary utility
    console.log("\n[3/7] Testing uploadToCloudinary stream utility with genuine image buffer...")
    const directUpload = await uploadToCloudinary(SAMPLE_PNG_BUFFER, {
      folder: "civicfix/test_uploads"
    })

    if (!directUpload.secure_url || !directUpload.secure_url.includes("cloudinary.com")) {
      throw new Error(`Unexpected secure_url: ${directUpload.secure_url}`)
    }
    uploadedPublicIds.push(directUpload.public_id)
    console.log(`✔ Direct buffer uploaded successfully!`)
    console.log(`  - Public ID: ${directUpload.public_id}`)
    console.log(`  - Secure URL: ${directUpload.secure_url}`)
    console.log(`  - Format: ${directUpload.format}, Size: ${directUpload.bytes} bytes`)

    // Verify URL returns HTTP 200
    const checkImageRes = await fetch(directUpload.secure_url)
    if (checkImageRes.status !== 200) {
      throw new Error(`Cloudinary image URL returned HTTP ${checkImageRes.status}`)
    }
    console.log(`✔ Cloudinary secure_url is publicly reachable (HTTP ${checkImageRes.status}).`)

    // 4. Connect to MongoDB and start test Express app
    console.log("\n[4/7] Connecting to MongoDB and starting test Express server...")
    await connectDB()
    const app = express()
    app.use(express.json({ limit: "10mb" }))
    app.use(cookieParser())
    app.use("/api/auth", authRoutes)
    app.use("/api/complaints", complaintRoutes)
    app.use(notFound)
    app.use(errorHandler)

    server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s))
    })
    const port = server.address().port
    baseUrl = `http://127.0.0.1:${port}`
    console.log(`✔ Test server listening on ${baseUrl}`)

    // Create a temporary citizen user
    const testEmail = `cloudinary_test_${Date.now()}@civicfix.org`
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Cloudinary Tester",
        email: testEmail,
        password: "Password123!"
      })
    })
    const regData = await regRes.json()
    if (regRes.status !== 201) throw new Error(`User registration failed: ${JSON.stringify(regData)}`)
    testToken = regData.token
    testUserId = regData.user.id
    console.log(`✔ Citizen authenticated: ${regData.user.name} (${testEmail})`)

    // 5. Test single image upload endpoint: POST /api/complaints/upload-image
    console.log("\n[5/7] Testing standalone endpoint: POST /api/complaints/upload-image...")
    const singleFormData = new FormData()
    singleFormData.append(
      "image",
      new Blob([SAMPLE_PNG_BUFFER], { type: "image/png" }),
      "road_damage_sample.png"
    )

    const singleUploadRes = await fetch(`${baseUrl}/api/complaints/upload-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${testToken}`
      },
      body: singleFormData
    })
    const singleData = await singleUploadRes.json()
    if (singleUploadRes.status !== 200 || !singleData.secure_url) {
      throw new Error(`Single image upload failed: ${JSON.stringify(singleData)}`)
    }
    uploadedPublicIds.push(singleData.public_id)
    console.log(`✔ POST /api/complaints/upload-image succeeded (HTTP 200):`)
    console.log(`  - Secure URL: ${singleData.secure_url}`)
    console.log(`  - Public ID: ${singleData.public_id}`)

    // 6. Test full complaint submission with multipart photos: POST /api/complaints
    console.log("\n[6/7] Testing multipart complaint submission with photographic evidence...")
    const complaintFormData = new FormData()
    complaintFormData.append("title", "Dangerous deep pothole on Madhya Marg")
    complaintFormData.append(
      "description",
      "Severe cavity in the left traffic lane causing accidents during rainy conditions near Sector 17 rotary."
    )
    complaintFormData.append("category", "Potholes & Road Damage")
    complaintFormData.append("categoryKey", "potholes")
    complaintFormData.append("location", "Madhya Marg near Sector 17 Rotary, Chandigarh")
    complaintFormData.append("coordinates", JSON.stringify({ lat: 30.7415, lng: 76.7794 }))
    complaintFormData.append("pincode", "160017")
    complaintFormData.append("urgency", "High")
    complaintFormData.append(
      "photos",
      new Blob([SAMPLE_PNG_BUFFER], { type: "image/png" }),
      "pothole_evidence_1.png"
    )

    const complaintRes = await fetch(`${baseUrl}/api/complaints`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${testToken}`
      },
      body: complaintFormData
    })
    const complaintData = await complaintRes.json()

    if (complaintRes.status !== 201 || !complaintData.success) {
      throw new Error(`Complaint submission failed (status ${complaintRes.status}): ${JSON.stringify(complaintData)}`)
    }

    const complaint = complaintData.complaint
    createdComplaintDocId = complaint._id
    console.log(`✔ Complaint created under ticket #${complaint.complaintId}`)
    console.log(`✔ Saved Primary Image URL: ${complaint.image}`)
    console.log(`✔ Saved Images List:`, complaint.images)

    if (!complaint.image.includes("cloudinary.com")) {
      throw new Error(`Expected Cloudinary URL in complaint.image, got: ${complaint.image}`)
    }
    if (!complaint.images || complaint.images.length === 0 || !complaint.images[0].includes("cloudinary.com")) {
      throw new Error(`Expected Cloudinary URL in complaint.images array`)
    }

    // Extract public_id from URL if possible for cleanup
    const urlMatch = complaint.image.match(/civicfix\/complaints\/[a-zA-Z0-9_-]+/)
    if (urlMatch) {
      uploadedPublicIds.push(urlMatch[0])
    }

    // Verify in MongoDB Atlas
    const dbComplaint = await Complaint.findById(complaint._id)
    if (!dbComplaint) throw new Error("Complaint not found in MongoDB Atlas.")
    if (!dbComplaint.image.includes("cloudinary.com")) {
      throw new Error("Complaint document in MongoDB lacks Cloudinary URL.")
    }
    console.log(`✔ Verified complaint document in MongoDB Atlas: ID ${dbComplaint._id}, Image: ${dbComplaint.image}`)

    // 7. Test invalid file format rejection
    console.log("\n[7/7] Testing file validation rejection for disallowed file type...")
    const invalidFormData = new FormData()
    invalidFormData.append(
      "image",
      new Blob(["Fake malicious executable code"], { type: "application/x-msdownload" }),
      "malicious.exe"
    )

    const invalidRes = await fetch(`${baseUrl}/api/complaints/upload-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${testToken}`
      },
      body: invalidFormData
    })
    const invalidData = await invalidRes.json()
    if (invalidRes.status !== 400 || invalidData.success !== false) {
      throw new Error(`Expected 400 rejection for invalid file type, got ${invalidRes.status}: ${JSON.stringify(invalidData)}`)
    }
    console.log(`✔ Disallowed file format correctly rejected (HTTP 400): "${invalidData.message}"`)

    console.log("\n==================================================")
    console.log("ALL CLOUDINARY & MULTER VERIFICATION TESTS PASSED!")
    console.log("==================================================")
  } catch (error) {
    console.error("\n❌ CLOUDINARY TEST SUITE FAILED:", error.message)
    process.exitCode = 1
  } finally {
    // Cleanup Cloudinary test images
    console.log("\n[Cleanup] Cleaning up test assets...")
    for (const pubId of uploadedPublicIds) {
      try {
        await deleteFromCloudinary(pubId)
        console.log(`  - Cleaned Cloudinary asset: ${pubId}`)
      } catch (err) {
        console.warn(`  - Could not delete asset ${pubId}:`, err.message)
      }
    }

    // Cleanup MongoDB test records
    if (createdComplaintDocId) {
      try {
        await Complaint.findByIdAndDelete(createdComplaintDocId)
        console.log(`  - Cleaned MongoDB complaint: ${createdComplaintDocId}`)
      } catch (err) {
        console.warn("  - Error cleaning complaint:", err.message)
      }
    }
    if (testUserId) {
      try {
        await User.findByIdAndDelete(testUserId)
        console.log(`  - Cleaned MongoDB user: ${testUserId}`)
      } catch (err) {
        console.warn("  - Error cleaning user:", err.message)
      }
    }

    if (server) {
      await new Promise((resolve) => server.close(resolve))
    }
    await mongoose.connection.close()
    console.log("✔ Cleanup complete and database connections closed.\n")
  }
}

runCloudinaryTests()
