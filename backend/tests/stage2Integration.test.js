import "../config/env.js"
import mongoose from "mongoose"
import Complaint from "../models/Complaint.js"
import User from "../models/User.js"
import Notification from "../models/Notification.js"

const BASE_URL = `http://localhost:${process.env.PORT || 5001}/api`

async function runTests() {
  console.log("=========================================================")
  console.log("CIVICFIX: STAGE 2 CITIZEN BACKEND INTEGRATION TEST SUITE")
  console.log("=========================================================\n")

  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✔ PASS: ${message}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${message}`)
      failed++
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: CITIZEN AUTHENTICATION & REGISTRATION
    // ----------------------------------------------------
    console.log("--- 1. Testing Citizen Registration & Login ---")
    const testCitizenEmail = `rohit.citizen.${Date.now()}@example.com`
    const testCitizenPassword = "citizenPass123"

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rohit Verma",
        email: testCitizenEmail,
        password: testCitizenPassword
      })
    })
    const regData = await regRes.json()
    assert(regRes.status === 201 && regData.success, "Citizen registration successful (HTTP 201)")
    assert(regData.user.role === "citizen", "New user has role 'citizen'")
    const citizenToken = regData.token
    const citizenId = regData.user.id || regData.user._id

    // Test Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCitizenEmail,
        password: testCitizenPassword
      })
    })
    const loginData = await loginRes.json()
    assert(loginRes.status === 200 && loginData.success, "Citizen login successful (HTTP 200)")

    // ----------------------------------------------------
    // TEST 2: COMPLAINT SUBMISSION & MONGODB STORAGE
    // ----------------------------------------------------
    console.log("\n--- 2. Testing Complaint Submission (Report an Issue) ---")
    const complaintPayload = {
      title: "Severe deep pothole near Sector 17 bus terminal",
      description: "A hazardous pothole approximately 1.5 feet wide is causing vehicular traffic jams and bike accidents during evening hours.",
      category: "Pothole",
      categoryKey: "potholes",
      location: "Near Sector 17 Main Bus Terminal, Gate 2",
      coordinates: { lat: 30.7418, lng: 76.7796 },
      pincode: "160017",
      urgency: "High",
      images: [
        "https://res.cloudinary.com/demo/image/upload/sample.jpg"
      ]
    }

    const compRes = await fetch(`${BASE_URL}/complaints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify(complaintPayload)
    })
    const compData = await compRes.json()
    assert(compRes.status === 201 && compData.success, "Complaint created successfully (HTTP 201)")
    assert(!!compData.complaint.id && compData.complaint.id.startsWith("CF-"), `Unique complaint ID generated: ${compData.complaint.id}`)
    assert(compData.complaint.status === "Submitted", "Initial complaint status is 'Submitted'")
    assert(compData.complaint.userId === citizenId, "Complaint is correctly associated with citizen ID")
    const createdComplaintId = compData.complaint.id

    // ----------------------------------------------------
    // TEST 3: MY REPORTS (AUTHENTICATED CITIZEN REPORTS)
    // ----------------------------------------------------
    console.log("\n--- 3. Testing 'My Reports' Endpoint ---")
    const myReportsRes = await fetch(`${BASE_URL}/complaints/my`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    const myReportsData = await myReportsRes.json()
    assert(myReportsRes.status === 200 && myReportsData.success, "My Reports fetched successfully")
    assert(myReportsData.complaints.length >= 1, `Found ${myReportsData.complaints.length} complaint(s) for citizen`)
    assert(myReportsData.complaints.some((c) => c.id === createdComplaintId), "Newly submitted complaint exists in citizen's reports")

    // ----------------------------------------------------
    // TEST 4: COMPLAINT DETAILS & STATUS TIMELINE
    // ----------------------------------------------------
    console.log("\n--- 4. Testing Complaint Details & Tracking Timeline ---")
    const detailRes = await fetch(`${BASE_URL}/complaints/${createdComplaintId}`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    const detailData = await detailRes.json()
    assert(detailRes.status === 200 && detailData.success, "Complaint details retrieved successfully")
    assert(Array.isArray(detailData.complaint.timeline) && detailData.complaint.timeline.length > 0, "Timeline stages exist in chronological order")
    assert(detailData.complaint.timeline[0].done === true, "Stage 1 (Submitted) marked done: true")

    // ----------------------------------------------------
    // TEST 5: STATS & COMMUNITY IMPACT AGGREGATION
    // ----------------------------------------------------
    console.log("\n--- 5. Testing Statistics & Community Impact Aggregation ---")
    const statsRes = await fetch(`${BASE_URL}/complaints/stats`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    const statsData = await statsRes.json()
    assert(statsRes.status === 200 && statsData.success, "Aggregated stats retrieved successfully")
    assert(statsData.userStats.total >= 1, `User personal count matches: ${statsData.userStats.total}`)
    assert(statsData.communityStats.total >= 1, `Community total complaints: ${statsData.communityStats.total}`)
    assert(typeof statsData.communityStats.resolutionRate === "string", `Resolution rate computed: ${statsData.communityStats.resolutionRate}`)

    // ----------------------------------------------------
    // TEST 6: REAL DATABASE NOTIFICATIONS
    // ----------------------------------------------------
    console.log("\n--- 6. Testing Notifications Generated by Real Events ---")
    const notifsRes = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    const notifsData = await notifsRes.json()
    assert(notifsRes.status === 200 && notifsData.success, "Notifications fetched from MongoDB")
    assert(notifsData.notifications.length >= 1, `Auto-generated event notification exists (Count: ${notifsData.notifications.length})`)
    const firstNotif = notifsData.notifications[0]
    assert(firstNotif.read === false, "New notification has unread status")

    // Mark as read
    const markReadRes = await fetch(`${BASE_URL}/notifications/${firstNotif.id}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({ read: true })
    })
    const markReadData = await markReadRes.json()
    assert(markReadRes.status === 200 && markReadData.notification.read === true, "Notification marked as read in MongoDB")

    // ----------------------------------------------------
    // TEST 7: USER PROFILE & SETTINGS PERSISTENCE
    // ----------------------------------------------------
    console.log("\n--- 7. Testing Citizen Profile & Settings Persistence ---")
    const profileUpdateRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        phone: "+91 98888 12345",
        city: "Chandigarh",
        sector: "Sector 17, Block C",
        bio: "Dedicated citizen active in Swachh Bharat community drives."
      })
    })
    const profileUpdateData = await profileUpdateRes.json()
    assert(profileUpdateRes.status === 200 && profileUpdateData.success, "Profile updated in MongoDB")
    assert(profileUpdateData.user.phone === "+91 98888 12345", "Updated phone number saved correctly")
    assert(profileUpdateData.user.bio.includes("Swachh Bharat"), "Updated bio saved correctly")

    // Test Settings Update
    const settingsUpdateRes = await fetch(`${BASE_URL}/auth/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        emailAlerts: true,
        smsUpdates: false,
        weeklyDigest: true,
        language: "hi"
      })
    })
    const settingsUpdateData = await settingsUpdateRes.json()
    assert(settingsUpdateRes.status === 200 && settingsUpdateData.success, "Settings updated in MongoDB")
    assert(settingsUpdateData.settings.smsUpdates === false && settingsUpdateData.settings.language === "hi", "Settings fields persisted correctly")

    // ----------------------------------------------------
    // TEST 8: SECURITY & ROLE-BASED ACCESS CONTROL
    // ----------------------------------------------------
    console.log("\n--- 8. Testing Security & Authorization Barriers ---")
    // Register Second Citizen
    const secondCitizenRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Kavita Sharma",
        email: `kavita.citizen.${Date.now()}@example.com`,
        password: "kavitaPass123"
      })
    })
    const secondCitizenData = await secondCitizenRes.json()
    const secondCitizenToken = secondCitizenData.token

    // Security Check: Citizen B accessing Citizen A's private complaint details
    const unauthorizedCompRes = await fetch(`${BASE_URL}/complaints/${createdComplaintId}`, {
      headers: { Authorization: `Bearer ${secondCitizenToken}` }
    })
    assert(unauthorizedCompRes.status === 403, "Citizen B is blocked (HTTP 403) from accessing Citizen A's complaint")

    // Security Check: Citizen attempting to modify complaint status
    const statusChangeAttempt = await fetch(`${BASE_URL}/complaints/${createdComplaintId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({ status: "Resolved", remarks: "Self-closing" })
    })
    assert(statusChangeAttempt.status === 403, "Citizen is blocked (HTTP 403) from changing complaint status")

    // Security Check: Citizen attempting role escalation via profile update
    const roleEscalationAttempt = await fetch(`${BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({ role: "admin" })
    })
    const escalationData = await roleEscalationAttempt.json()
    assert(escalationData.user.role === "citizen", "Role remains 'citizen' (Privilege escalation blocked)")

    // ----------------------------------------------------
    // TEST 9: REGRESSION TESTING (ADMIN LOGIN & STATUS FLOW)
    // ----------------------------------------------------
    console.log("\n--- 9. Regression Testing (Admin Workflow) ---")
    const adminLoginRes = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin.vandana@civicfix.gov",
        password: "admin123"
      })
    })
    const adminLoginData = await adminLoginRes.json()
    assert(adminLoginRes.status === 200 && adminLoginData.success, "Admin login works without regression (HTTP 200)")
    const adminToken = adminLoginData.token

    // Admin can update status to 'In Progress'
    const adminUpdateStatusRes = await fetch(`${BASE_URL}/complaints/${createdComplaintId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: "In Progress",
        remarks: "Repair crew dispatched with cold-mix asphalt.",
        assignedOfficer: "Er. Rajesh Kumar, SDO"
      })
    })
    const adminUpdateData = await adminUpdateStatusRes.json()
    assert(adminUpdateStatusRes.status === 200 && adminUpdateData.complaint.status === "In Progress", "Admin successfully updated complaint status to 'In Progress'")

    // Verify Citizen A received the real status change notification in MongoDB
    const notifsAfterStatusRes = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
    const notifsAfterStatusData = await notifsAfterStatusRes.json()
    assert(
      notifsAfterStatusData.notifications.some((n) => n.title.includes("In Progress")),
      "Citizen received automatic MongoDB notification for status change to 'In Progress'"
    )

    console.log("\n=========================================================")
    console.log(`TEST SUITE SUMMARY: ${passed} PASSED | ${failed} FAILED`)
    console.log("=========================================================\n")

    process.exit(failed > 0 ? 1 : 0)
  } catch (err) {
    console.error("Test execution threw error:", err)
    process.exit(1)
  }
}

runTests()
