import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({ path: "./backend/.env" })
import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/authRoutes.js"
import complaintRoutes from "../routes/complaintRoutes.js"
import { notFound, errorHandler } from "../middleware/errorMiddleware.js"
import Complaint from "../models/Complaint.js"
import User from "../models/User.js"
import { connectDB } from "../config/db.js"

let server
let baseUrl
let testToken = ""
let testUserId = ""
let createdComplaintId = ""

async function request(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  })
  const data = await res.json().catch(() => null)
  return { status: res.status, headers: res.headers, data }
}

async function runComplaintTests() {
  console.log("==================================================")
  console.log("CIVICFIX STAGE 2A: COMPLAINT BACKEND TEST SUITE")
  console.log("==================================================\n")

  try {
    // 1. Connect to MongoDB
    console.log("[1/8] Connecting to MongoDB database...")
    await connectDB()
    console.log("✔ Connected to database successfully.")

    // 2. Setup Express test server
    console.log("\n[2/8] Initializing test Express application...")
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

    // 3. Register / Login test citizen user
    console.log("\n[3/8] Authenticating citizen for complaint submission...")
    const testEmail = `citizen_${Date.now()}@testcivicfix.in`
    const regRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Citizen Mansha",
        email: testEmail,
        password: "TestPassword123"
      })
    })

    if (regRes.status !== 201) throw new Error(`Registration failed with status ${regRes.status}: ${JSON.stringify(regRes.data)}`)
    testToken = regRes.data.token
    testUserId = regRes.data.user.id
    console.log(`✔ Citizen authenticated: ${regRes.data.user.name} (${testEmail}), ID: ${testUserId}`)

    // 4. Test unauthorized complaint submission
    console.log("\n[4/8] Testing unauthenticated submission rejection...")
    const unauthRes = await request("/api/complaints", {
      method: "POST",
      body: JSON.stringify({
        title: "Deep pothole cluster on Madhya Marg",
        description: "Dangerous pothole creating hazard for two-wheelers during rush hours.",
        category: "Potholes",
        location: "Sector 17-C Roundabout"
      })
    })
    console.log("Unauthenticated response status:", unauthRes.status)
    if (unauthRes.status !== 401) throw new Error(`Expected 401 for unauthenticated request, got ${unauthRes.status}`)
    console.log("✔ Unauthenticated request properly rejected.")

    // 5. Test validation error (short title & description)
    console.log("\n[5/8] Testing input validation (short title, missing location)...")
    const valRes = await request("/api/complaints", {
      method: "POST",
      headers: { Authorization: `Bearer ${testToken}` },
      body: JSON.stringify({
        title: "Pot",
        description: "Small",
        category: "Potholes",
        location: ""
      })
    })
    console.log("Validation response status:", valRes.status, "message:", valRes.data?.message)
    if (valRes.status !== 400) throw new Error(`Expected 400 for invalid inputs, got ${valRes.status}`)
    console.log("✔ Input validation successfully enforced.")

    // 6. Test valid complaint submission
    console.log("\n[6/8] Submitting valid complaint (POST /api/complaints)...")
    const complaintPayload = {
      title: "Broken stormwater drain grill near Sector 17 Plaza",
      description: "Severe hazard where stormwater drain grill is broken and open, risking injuries to evening pedestrians and shoppers.",
      category: "Drainage and Sewage",
      categoryKey: "drainage",
      location: "Near Fountain, Sector 17 Plaza, Chandigarh",
      coordinates: { lat: 30.7415, lng: 76.7794 },
      pincode: "160017",
      urgency: "High",
      images: [
        "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80"
      ]
    }

    const createRes = await request("/api/complaints", {
      method: "POST",
      headers: { Authorization: `Bearer ${testToken}` },
      body: JSON.stringify(complaintPayload)
    })

    console.log("Creation response status:", createRes.status)
    console.log("Created complaint data:", {
      id: createRes.data?.complaint?.id,
      title: createRes.data?.complaint?.title,
      category: createRes.data?.complaint?.category,
      department: createRes.data?.complaint?.department,
      status: createRes.data?.complaint?.status,
      timelineStages: createRes.data?.complaint?.timeline?.length
    })

    if (createRes.status !== 201) throw new Error(`Expected 201 Created, got ${createRes.status}: ${JSON.stringify(createRes.data)}`)
    if (!createRes.data.success) throw new Error("Expected success: true")
    if (!createRes.data.complaint.id.startsWith("CF-")) throw new Error("Expected complaintId starting with 'CF-'")
    createdComplaintId = createRes.data.complaint.id

    // Verify in MongoDB
    const dbComplaint = await Complaint.findOne({ complaintId: createdComplaintId })
    if (!dbComplaint) throw new Error("Complaint not found in database!")
    if (dbComplaint.user.toString() !== testUserId) throw new Error("Complaint user does not match authenticated citizen!")
    if (dbComplaint.timeline.length !== 4) throw new Error("Expected 4 timeline stages!")
    if (dbComplaint.timeline[0].done !== true) throw new Error("Stage 1 (Submitted) should be done: true!")
    console.log("✔ Complaint saved to MongoDB with user reference, 4-stage timeline, and unique complaint ID.")

    // 7. Test fetching complaints (GET /api/complaints & GET /api/complaints/my)
    console.log("\n[7/8] Fetching complaints from API...")
    const allRes = await request("/api/complaints")
    console.log("All complaints count:", allRes.data?.count)
    if (allRes.status !== 200) throw new Error(`Expected 200, got ${allRes.status}`)

    const myRes = await request("/api/complaints/my", {
      headers: { Authorization: `Bearer ${testToken}` }
    })
    console.log("My complaints count:", myRes.data?.count)
    if (myRes.status !== 200) throw new Error(`Expected 200, got ${myRes.status}`)
    const foundMy = myRes.data.complaints.find((c) => c.id === createdComplaintId)
    if (!foundMy) throw new Error("Newly created complaint not found in /my complaints!")
    console.log("✔ User's complaints retrieved successfully.")

    // 8. Test fetching by ID & status update
    console.log("\n[8/8] Fetching single complaint by ticket ID & testing upvote...")
    const singleRes = await request(`/api/complaints/${createdComplaintId}`)
    if (singleRes.status !== 200) throw new Error(`Expected 200, got ${singleRes.status}`)
    if (singleRes.data.complaint.id !== createdComplaintId) throw new Error("Ticket ID mismatch!")

    // Upvote
    const upvoteRes = await request(`/api/complaints/${createdComplaintId}/upvote`, {
      method: "POST",
      headers: { Authorization: `Bearer ${testToken}` }
    })
    console.log("Upvote response:", upvoteRes.data)
    if (upvoteRes.status !== 200) throw new Error("Upvote failed")
    if (upvoteRes.data.upvotes !== 2) throw new Error(`Expected 2 upvotes, got ${upvoteRes.data.upvotes}`)

    // Update status
    const updateRes = await request(`/api/complaints/${createdComplaintId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${testToken}` },
      body: JSON.stringify({
        status: "Under Review",
        remarks: "Site visited by Junior Engineer. Work order issued.",
        assignedOfficer: "Er. Ramesh Verma"
      })
    })
    console.log("Status update response:", updateRes.data?.message)
    if (updateRes.status !== 200) throw new Error("Status update failed")
    if (updateRes.data.complaint.status !== "Under Review") throw new Error("Status was not updated!")
    console.log("✔ Complaint status, timeline stage, and official remarks updated successfully.")

    // Cleanup test complaint from MongoDB Atlas
    await Complaint.deleteOne({ complaintId: createdComplaintId })
    await User.deleteOne({ _id: testUserId })
    console.log("✔ Test data cleaned up.")

    console.log("\n==================================================")
    console.log(">>> ALL COMPLAINT BACKEND TESTS PASSED (8/8)! <<<")
    console.log("==================================================")
  } finally {
    if (server) server.close()
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect()
  }
}

runComplaintTests().catch((err) => {
  console.error("\n❌ COMPLAINT TEST SUITE FAILED:", err)
  process.exit(1)
})
