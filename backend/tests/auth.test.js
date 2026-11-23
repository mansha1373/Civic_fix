import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/authRoutes.js"
import User from "../models/User.js"
import { notFound, errorHandler } from "../middleware/errorMiddleware.js"

let mongod
let server
let baseUrl

// Helper fetch wrapper
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

async function runTests() {
  console.log("==========================================")
  console.log("CIVICFIX BACKEND INTEGRATION TEST SUITE")
  console.log("==========================================\n")

  try {
    // 1. Setup in-memory MongoDB
    console.log("[1/9] Initializing in-memory MongoDB server...")
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    process.env.MONGO_URI = uri
    process.env.JWT_SECRET = "test_super_secret_jwt_key_at_least_32_characters"
    process.env.NODE_ENV = "test"

    await mongoose.connect(uri)
    console.log("✔ Connected to in-memory MongoDB successfully at:", uri)

    // 2. Setup Express server
    console.log("\n[2/9] Starting test Express application...")
    const app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use("/api/auth", authRoutes)
    app.use(notFound)
    app.use(errorHandler)

    server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s))
    })
    const port = server.address().port
    baseUrl = `http://127.0.0.1:${port}`
    console.log(`✔ Test server listening on ${baseUrl}`)

    // 3. Test Registration
    console.log("\n[3/9] Testing citizen registration (POST /api/auth/register)...")
    const regRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Mansha Verma",
        email: "mansha@gmail.com",
        password: "SecurePassword123"
      })
    })

    console.log("Response status:", regRes.status)
    console.log("Response data:", regRes.data)

    if (regRes.status !== 201) throw new Error(`Expected 201, got ${regRes.status}`)
    if (!regRes.data.success) throw new Error("Expected success: true")
    if (regRes.data.user.name !== "Mansha Verma") throw new Error("User name mismatch")
    if (regRes.data.user.role !== "citizen") throw new Error("Default role must be citizen")
    if (regRes.data.user.password) throw new Error("Password must not be returned in API response")

    // Check cookie
    const setCookie = regRes.headers.get("set-cookie")
    console.log("Set-Cookie header:", setCookie)
    if (!setCookie || !setCookie.includes("jwt=")) throw new Error("Expected HTTP-only jwt cookie in response")

    // Verify in database that password was actually hashed with bcrypt
    const dbUser = await User.findOne({ email: "mansha@gmail.com" }).select("+password")
    console.log("Database user document password hash:", dbUser.password.slice(0, 20) + "...")
    if (dbUser.password === "SecurePassword123") throw new Error("Password was stored in plain text!")
    if (!dbUser.password.startsWith("$2a$") && !dbUser.password.startsWith("$2b$")) {
      throw new Error("Password does not appear to be a valid bcrypt hash!")
    }
    console.log("✔ User created, password securely hashed with bcrypt, safe response returned.")

    // 4. Test Duplicate Email
    console.log("\n[4/9] Testing duplicate email registration prevention...")
    const dupRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Mansha Duplicate",
        email: "mansha@gmail.com",
        password: "OtherPassword456"
      })
    })

    console.log("Duplicate status:", dupRes.status, "message:", dupRes.data?.message)
    if (dupRes.status !== 400) throw new Error(`Expected 400 for duplicate, got ${dupRes.status}`)
    if (dupRes.data.success !== false) throw new Error("Expected success: false for duplicate")
    console.log("✔ Duplicate email registration properly blocked.")

    // 5. Test Input Validation
    console.log("\n[5/9] Testing input validation (short password, invalid email)...")
    const valRes = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "A",
        email: "not-an-email",
        password: "123"
      })
    })
    console.log("Validation status:", valRes.status, "message:", valRes.data?.message)
    if (valRes.status !== 400) throw new Error(`Expected 400 for invalid input, got ${valRes.status}`)
    console.log("✔ Input validation successfully enforced.")

    // 6. Test Login with Valid Credentials
    console.log("\n[6/9] Testing login with valid credentials (POST /api/auth/login)...")
    const loginRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "mansha@gmail.com",
        password: "SecurePassword123"
      })
    })
    console.log("Login status:", loginRes.status)
    if (loginRes.status !== 200) throw new Error(`Expected 200, got ${loginRes.status}`)
    if (!loginRes.data.token) throw new Error("Expected JWT token in login response")
    const authToken = loginRes.data.token
    console.log("✔ Login successful, token generated.")

    // 7. Test Login with Incorrect Credentials
    console.log("\n[7/9] Testing login with incorrect password...")
    const wrongPassRes = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "mansha@gmail.com",
        password: "WrongPassword"
      })
    })
    console.log("Wrong password status:", wrongPassRes.status, "message:", wrongPassRes.data?.message)
    if (wrongPassRes.status !== 401) throw new Error(`Expected 401, got ${wrongPassRes.status}`)
    console.log("✔ Incorrect credentials rejected.")

    // 8. Test Protected Route GET /api/auth/me
    console.log("\n[8/9] Testing GET /api/auth/me with Bearer token...")
    const meRes = await request("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    console.log("Me status:", meRes.status, "User:", meRes.data?.user?.name)
    if (meRes.status !== 200) throw new Error(`Expected 200, got ${meRes.status}`)
    if (meRes.data.user.email !== "mansha@gmail.com") throw new Error("Incorrect user returned from /me")

    // Test GET /api/auth/me without token
    const unauthRes = await request("/api/auth/me", { method: "GET" })
    console.log("Unauthenticated status:", unauthRes.status)
    if (unauthRes.status !== 401) throw new Error(`Expected 401, got ${unauthRes.status}`)
    console.log("✔ Protected route correctly allows authenticated and blocks unauthenticated requests.")

    // 9. Test Logout
    console.log("\n[9/9] Testing logout (POST /api/auth/logout)...")
    const logoutRes = await request("/api/auth/logout", { method: "POST" })
    console.log("Logout status:", logoutRes.status)
    const logoutCookie = logoutRes.headers.get("set-cookie")
    console.log("Logout Set-Cookie:", logoutCookie)
    if (logoutRes.status !== 200) throw new Error(`Expected 200, got ${logoutRes.status}`)
    if (!logoutCookie || !logoutCookie.includes("Expires=Thu, 01 Jan 1970")) {
      throw new Error("Expected cookie to be cleared on logout")
    }
    console.log("✔ Logout successfully cleared authentication cookie.")

    console.log("\n==========================================")
    console.log(">>> ALL BACKEND INTEGRATION TESTS PASSED! <<<")
    console.log("==========================================")
  } finally {
    if (server) server.close()
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect()
    if (mongod) await mongod.stop()
  }
}

runTests().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED:", err)
  process.exit(1)
})
