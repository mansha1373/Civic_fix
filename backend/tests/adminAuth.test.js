import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({ path: "./backend/.env" })
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/authRoutes.js"
import { notFound, errorHandler } from "../middleware/errorMiddleware.js"
import { protect, requireAdmin, requireCitizen } from "../middleware/authMiddleware.js"
import User from "../models/User.js"
import { connectDB } from "../config/db.js"
import { autoProvisionAdmin } from "../utils/adminProvisioner.js"

let server
let baseUrl

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
  return { status: res.status, data }
}

async function runAdminAuthTests() {
  console.log("==================================================")
  console.log("CIVICFIX: ROLE-BASED AUTH & ADMIN SUITE")
  console.log("==================================================\n")

  try {
    // 1. Connect to MongoDB
    console.log("[1/8] Connecting to MongoDB database...")
    await connectDB()
    console.log("✔ Connected to database successfully.")

    // 2. Setup Express test server with protected role test routes
    console.log("\n[2/8] Initializing test Express application...")
    const app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use("/api/auth", authRoutes)

    // Dedicated test routes for role authorization
    app.get("/api/test/admin-only", protect, requireAdmin, (req, res) => {
      res.status(200).json({ success: true, message: "Welcome Administrator", user: req.user.toSafeObject() })
    })
    app.get("/api/test/citizen-only", protect, requireCitizen, (req, res) => {
      res.status(200).json({ success: true, message: "Welcome Citizen", user: req.user.toSafeObject() })
    })

    app.use(notFound)
    app.use(errorHandler)

    server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s))
    })
    const port = server.address().port
    baseUrl = `http://127.0.0.1:${port}`
    console.log(`✔ Test server listening on ${baseUrl}`)

    // 3. Provision Admin
    console.log("\n[3/8] Testing server-side Admin provisioning...")
    await autoProvisionAdmin()
    const adminUser = await User.findOne({ email: "admin.vandana@civicfix.gov" }).select("+password")
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Admin user not found or does not have role 'admin'")
    }
    const isPasswordHashed = adminUser.password.startsWith("$2")
    if (!isPasswordHashed) {
      throw new Error("Admin password is not securely hashed with bcrypt!")
    }
    console.log(`✔ Admin account verified in MongoDB Atlas: ${adminUser.name} (${adminUser.email}), Role: ${adminUser.role}`)
    console.log(`✔ Admin password is confirmed securely hashed with bcrypt.`)

    // 4. Register a standard Citizen
    console.log("\n[4/8] Registering standard citizen account...")
    const citizenEmail = `citizen_${Date.now()}@civictest.org`
    const regRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Citizen Sharma",
        email: citizenEmail,
        password: "CitizenPassword123"
      })
    })
    if (regRes.status !== 201 || regRes.data.user.role !== "citizen") {
      throw new Error(`Citizen registration failed: ${JSON.stringify(regRes.data)}`)
    }
    const citizenToken = regRes.data.token
    console.log(`✔ Citizen registered with enforced role 'citizen': ${citizenEmail}`)

    // 5. Test Citizen attempting to log in on Admin Login
    console.log("\n[5/8] Testing Citizen login attempt on Admin portal (should be rejected)...")
    const citizenOnAdminRes = await request("/api/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({
        email: citizenEmail,
        password: "CitizenPassword123"
      })
    })
    if (citizenOnAdminRes.status !== 403) {
      throw new Error(`Expected HTTP 403 for citizen on admin portal, got ${citizenOnAdminRes.status}`)
    }
    console.log(`✔ Citizen correctly rejected on Admin portal (HTTP 403): "${citizenOnAdminRes.data.message}"`)

    // 6. Test Admin attempting to log in on Citizen Login
    console.log("\n[6/8] Testing Admin login attempt on Citizen portal (should be rejected)...")
    const adminOnCitizenRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin.vandana@civicfix.gov",
        password: "admin123"
      })
    })
    if (adminOnCitizenRes.status !== 403) {
      throw new Error(`Expected HTTP 403 for admin on citizen portal, got ${adminOnCitizenRes.status}`)
    }
    console.log(`✔ Admin correctly rejected on Citizen portal (HTTP 403): "${adminOnCitizenRes.data.message}"`)

    // 7. Test Admin Login on Admin portal
    console.log("\n[7/8] Testing Administrator authentication on Admin portal...")
    const adminLoginRes = await request("/api/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin.vandana@civicfix.gov",
        password: "admin123"
      })
    })
    if (adminLoginRes.status !== 200 || !adminLoginRes.data.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(adminLoginRes.data)}`)
    }
    const adminToken = adminLoginRes.data.token
    if (adminLoginRes.data.user.role !== "admin") {
      throw new Error(`Expected role 'admin', got '${adminLoginRes.data.user.role}'`)
    }
    console.log(`✔ Admin authenticated successfully with verified role 'admin'.`)

    // 8. Test Route Access Control (Citizen token vs Admin token)
    console.log("\n[8/8] Testing backend route access guards...")

    // Admin accessing admin route -> allowed
    const adminOnAdminRoute = await request("/api/test/admin-only", {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
    if (adminOnAdminRoute.status !== 200) {
      throw new Error(`Admin failed to access admin-only route: HTTP ${adminOnAdminRoute.status}`)
    }
    console.log(`✔ Admin authorized for admin-only route (HTTP 200).`)

    // Citizen accessing admin route -> 403
    const citizenOnAdminRoute = await request("/api/test/admin-only", {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    if (citizenOnAdminRoute.status !== 403) {
      throw new Error(`Citizen was NOT blocked from admin route: HTTP ${citizenOnAdminRoute.status}`)
    }
    console.log(`✔ Citizen blocked from admin-only route (HTTP 403): "${citizenOnAdminRoute.data.message}"`)

    // Unauthenticated accessing admin route -> 401
    const unauthOnAdminRoute = await request("/api/test/admin-only")
    if (unauthOnAdminRoute.status !== 401) {
      throw new Error(`Unauthenticated visitor was NOT blocked: HTTP ${unauthOnAdminRoute.status}`)
    }
    console.log(`✔ Unauthenticated visitor rejected from protected route (HTTP 401).`)

    console.log("\n==================================================")
    console.log("ALL ROLE-BASED AUTH & ADMIN TESTS PASSED!")
    console.log("==================================================")
  } catch (err) {
    console.error("\n❌ ADMIN AUTH TEST FAILED:", err.message)
    process.exitCode = 1
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve))
    }
    await mongoose.connection.close()
    console.log("✔ Server and database connection closed.\n")
  }
}

runAdminAuthTests()
