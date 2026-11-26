const BASE_URL = "http://localhost:5001/api"

async function runTests() {
  console.log("==================================================")
  console.log("CIVICFIX CRITICAL BUG FIX E2E INTEGRATION SUITE")
  console.log("==================================================\n")

  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✔ PASS: ${message}`)
      passed++
    } else {
      console.error(`  ✖ FAIL: ${message}`)
      failed++
    }
  }

  const testEmail = `citizen.${Date.now()}@example.com`
  const testPassword = "SecurePassword123!"
  const testName = "Aman Preet Singh"

  let citizenToken = ""
  let citizenUser = null
  let complaintId = ""

  // ----------------------------------------------------
  // TEST 1: New User Registration & MongoDB Persistence
  // ----------------------------------------------------
  console.log("--- TEST 1: New Citizen Registration & MongoDB Persistence ---")
  try {
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword
      })
    })

    const regData = await regRes.json()
    assert(regRes.status === 201, `Status is 201 Created (got ${regRes.status})`)
    assert(regData.success === true, "Response has success: true")
    assert(Boolean(regData.token), "JWT token returned in registration response")
    assert(regData.user?.email === testEmail.toLowerCase(), "User email matches registration")
    assert(regData.user?.role === "citizen", "User role is 'citizen'")
    assert(!regData.user?.password, "Password is NOT exposed in response")

    citizenToken = regData.token
    citizenUser = regData.user

    // Verify session restoration via /api/auth/me (validates persistent DB retrieval)
    const checkUserRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    const checkUserData = await checkUserRes.json()
    assert(checkUserRes.status === 200, "User document successfully retrieved from persistent database via /auth/me")
    assert(checkUserData.user?.email === testEmail.toLowerCase(), "Retrieved database user email matches")
    assert(!checkUserData.user?.password, "Password hash is safely excluded from user object")
  } catch (err) {
    console.error("Test 1 failed with error:", err.message)
    failed++
  }

  // ----------------------------------------------------
  // TEST 2: Login & Authentication
  // ----------------------------------------------------
  console.log("\n--- TEST 2: Citizen Login & JWT Verification ---")
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    })

    const loginData = await loginRes.json()
    assert(loginRes.status === 200, `Login returns 200 OK (got ${loginRes.status})`)
    assert(loginData.success === true, "Login response has success: true")
    assert(Boolean(loginData.token), "Login returned valid JWT token")
    assert(loginData.user?.name === testName, "Authenticated user name matches")

    // Verify /api/auth/me returns current session
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${loginData.token}` }
    })
    const meData = await meRes.json()
    assert(meRes.status === 200, "/api/auth/me returns 200 OK")
    assert(meData.user?.email === testEmail.toLowerCase(), "Session restored for authenticated citizen")
  } catch (err) {
    console.error("Test 2 failed with error:", err.message)
    failed++
  }

  // ----------------------------------------------------
  // TEST 3: Complaint Submission (No Blank Page / String Location)
  // ----------------------------------------------------
  console.log("\n--- TEST 3: Citizen Complaint Submission & Data Shape ---")
  try {
    const compRes = await fetch(`${BASE_URL}/complaints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        title: "Deep pothole causing hazards near Market 17",
        description: "Dangerous open depression on the main avenue near Sector 17 Plaza causing vehicle slowdowns and safety hazards.",
        category: "Potholes & Road Damage",
        categoryKey: "potholes",
        location: "Sector 17 Plaza Main Boulevard, Chandigarh",
        coordinates: { lat: 30.7415, lng: 76.7794 },
        urgency: "High",
        pincode: "160017"
      })
    })

    const compData = await compRes.json()
    assert(compRes.status === 201, `Status is 201 Created (got ${compRes.status})`)
    assert(compData.success === true, "Complaint created successfully")
    assert(Boolean(compData.complaint?.complaintId), `Complaint ID issued: #${compData.complaint?.complaintId}`)

    // CRITICAL: Location MUST be a string to prevent React "Objects are not valid as a React child" error!
    assert(
      typeof compData.complaint?.location === "string",
      `Location is primitive string (got ${typeof compData.complaint?.location}): "${compData.complaint?.location}"`
    )
    assert(compData.complaint?.status === "Submitted", "Default status is 'Submitted'")
    assert(compData.complaint?.userId === citizenUser?.id, "Complaint is linked to citizen user ID")

    complaintId = compData.complaint?.complaintId

    // Verify stored complaint via persistent API
    const getCompRes = await fetch(`${BASE_URL}/complaints/${complaintId}`)
    const getCompData = await getCompRes.json()
    assert(getCompRes.status === 200, "Complaint document successfully retrieved from database via /complaints/:id")
    assert(getCompData.complaint?.title === "Deep pothole causing hazards near Market 17", "Database title matches")
    assert(getCompData.complaint?.timeline.length >= 1, "Timeline stages initialized in database")
  } catch (err) {
    console.error("Test 3 failed with error:", err.message)
    failed++
  }

  // ----------------------------------------------------
  // TEST 4: Citizen Dashboard (My Reports)
  // ----------------------------------------------------
  console.log("\n--- TEST 4: Citizen My Reports Listing ---")
  try {
    const myRes = await fetch(`${BASE_URL}/complaints/my`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    const myData = await myRes.json()
    assert(myRes.status === 200, "My complaints returns 200 OK")
    assert(Array.isArray(myData.complaints), "Returns complaints array")
    const found = myData.complaints.find((c) => c.complaintId === complaintId || c.id === complaintId)
    assert(Boolean(found), `Submitted complaint #${complaintId} appears in citizen's My Reports`)
    assert(typeof found?.location === "string", "Location in My Reports is safe string for React rendering")
  } catch (err) {
    console.error("Test 4 failed with error:", err.message)
    failed++
  }

  // ----------------------------------------------------
  // TEST 5: Admin Dashboard Synchronization & Status Update
  // ----------------------------------------------------
  console.log("\n--- TEST 5: Admin Dashboard Synchronization & Management ---")
  try {
    // 5.1 Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin.vandana@civicfix.gov",
        password: "admin123"
      })
    })
    const adminLoginData = await adminLoginRes.json()
    assert(adminLoginRes.status === 200, "Admin login returns 200 OK")
    const adminToken = adminLoginData.token

    // 5.2 Admin All Complaints
    const adminCompsRes = await fetch(`${BASE_URL}/complaints`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
    const adminCompsData = await adminCompsRes.json()
    const foundInAdmin = adminCompsData.complaints?.find((c) => c.complaintId === complaintId || c.id === complaintId)
    assert(Boolean(foundInAdmin), `Citizen complaint #${complaintId} appears in Admin All Complaints list`)
    assert(foundInAdmin?.citizen?.name === testName, `Admin sees correct citizen name: "${foundInAdmin?.citizen?.name}"`)

    // 5.3 Admin updates status to "Under Review"
    const updateRes = await fetch(`${BASE_URL}/complaints/${foundInAdmin._id || complaintId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: "Under Review",
        remarks: "Junior Engineer dispatched for on-site boundary measurement."
      })
    })
    const updateData = await updateRes.json()
    assert(updateRes.status === 200, "Admin status update returns 200 OK")
    assert(updateData.complaint?.status === "Under Review", "Complaint status updated to 'Under Review'")

    // 5.4 Check that citizen receives notification via persistent API
    const notifRes = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    const notifData = await notifRes.json()
    assert(notifRes.status === 200, "Citizen notifications retrieved successfully")
    const updateNotif = notifData.notifications?.find((n) => n.complaintId === complaintId || n.type === "status_update")
    assert(Boolean(updateNotif), "Citizen received automatic notification in database for admin status update")
  } catch (err) {
    console.error("Test 5 failed with error:", err.message)
    failed++
  }

  // ----------------------------------------------------
  // TEST 6: Error Handling & Security Boundary Tests
  // ----------------------------------------------------
  console.log("\n--- TEST 6: Error Handling & Security Checks ---")
  try {
    // 6.1 Duplicate email registration rejected
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate User",
        email: testEmail,
        password: "AnotherPassword123!"
      })
    })
    assert(dupRes.status === 400, `Duplicate email registration rejected with 400 (got ${dupRes.status})`)

    // 6.2 Invalid login credentials rejected
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "WrongPassword999!"
      })
    })
    assert(badLoginRes.status === 401, `Invalid password rejected with 401 (got ${badLoginRes.status})`)

    // 6.3 Unauthenticated complaint submission rejected
    const unauthCompRes = await fetch(`${BASE_URL}/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Complaint Without Auth",
        description: "This should fail because no JWT token is provided.",
        category: "potholes",
        location: "Sector 17, Chandigarh"
      })
    })
    assert(unauthCompRes.status === 401, `Unauthenticated complaint submission rejected with 401 (got ${unauthCompRes.status})`)

    // 6.4 Non-admin cannot call admin endpoints
    const forbiddenRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    assert(forbiddenRes.status === 403, `Citizen blocked from /api/admin/stats with 403 Forbidden (got ${forbiddenRes.status})`)
  } catch (err) {
    console.error("Test 6 failed with error:", err.message)
    failed++
  }

  console.log("\n==================================================")
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`)
  console.log("==================================================")

  process.exit(failed > 0 ? 1 : 0)
}

runTests().catch((err) => {
  console.error("FATAL ERROR RUNNING SUITE:", err)
  process.exit(1)
})
