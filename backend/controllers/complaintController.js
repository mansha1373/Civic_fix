import { validationResult } from "express-validator"
import Complaint from "../models/Complaint.js"

// Category to Department mapping
const DEPARTMENT_MAPPING = {
  potholes: "MCC Roads & Pavements Wing",
  damaged_roads: "MCC Highway & Infrastructure Wing",
  garbage: "Sanitation & Swachh Bharat Cell",
  drainage: "Public Health Engineering Dept",
  streetlights: "Electrical Maintenance Division",
  other: "Municipal Enforcement & Civil Wing"
}

// Generate unique human-readable complaint ID (e.g. CF-2024-8921)
async function generateUniqueComplaintId() {
  const year = new Date().getFullYear()
  let isUnique = false
  let candidateId = ""

  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    candidateId = `CF-${year}-${randomNum}`
    const existing = await Complaint.findOne({ complaintId: candidateId })
    if (!existing) {
      isUnique = true
    }
  }

  return candidateId
}

/**
 * @desc    Create a new civic complaint
 * @route   POST /api/complaints
 * @access  Private (Authenticated Citizen)
 */
export async function createComplaint(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    })
  }

  const {
    title,
    description,
    category,
    categoryKey = "other",
    location,
    coordinates,
    pincode = "160017",
    urgency = "High",
    images = [],
    image
  } = req.body

  const complaintId = await generateUniqueComplaintId()
  const department =
    DEPARTMENT_MAPPING[categoryKey] ||
    DEPARTMENT_MAPPING[category?.toLowerCase()] ||
    "Municipal Corporation Civil Wing"

  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  })

  // Primary image fallback
  const primaryImage =
    image ||
    (images.length > 0 ? images[0] : null) ||
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"

  // Initialize official timeline stages
  const timeline = [
    {
      stage: "Submitted",
      status: "Submitted",
      step: "Report Submitted",
      date: `${formattedDate}, ${formattedTime}`,
      done: true,
      desc: `Received via CivicFix citizen portal by citizen ${req.user.name}.`,
      adminRemarks: "Complaint logged and ticket issued."
    },
    {
      stage: "Under Review",
      status: "Under Review",
      step: "Field Officer Inspection",
      date: "Pending Assignment",
      done: false,
      desc: `Junior Engineer triage and boundary verification by ${department}.`,
      adminRemarks: ""
    },
    {
      stage: "In Progress",
      status: "In Progress",
      step: "Work Order Execution",
      date: "Pending",
      done: false,
      desc: "Municipal repair crew deployed for on-site physical resolution.",
      adminRemarks: ""
    },
    {
      stage: "Resolved",
      status: "Resolved",
      step: "Final Resolution & Sign-off",
      date: "Pending",
      done: false,
      desc: "Photographic inspection verification and citizen sign-off.",
      adminRemarks: ""
    }
  ]

  // Initialize initial official dispatch remark
  const officialRemarks = [
    {
      id: `rem-${complaintId}-1`,
      author: "CivicFix Citizen Central Dispatch",
      role: "MCC Control Room",
      date: `${formattedDate}, ${formattedTime}`,
      message: `Your complaint has been received and registered under ticket #${complaintId}. Automated alert transmitted to ${department}.`
    }
  ]

  const complaint = await Complaint.create({
    complaintId,
    user: req.user._id,
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    categoryKey,
    location: location.trim(),
    coordinates: {
      lat: coordinates?.lat || 30.7415,
      lng: coordinates?.lng || 76.7794
    },
    pincode: pincode.trim(),
    urgency,
    status: "Submitted",
    statusKey: "submitted",
    department,
    assignedOfficer: "Pending Field Verification",
    estimatedResolution: "Within 3-5 business days",
    image: primaryImage,
    images: images.length > 0 ? images : [primaryImage],
    photoCount: images.length > 0 ? images.length : 1,
    upvotes: 1,
    officialRemarks,
    timeline,
    isUserCreated: true
  })

  res.status(201).json({
    success: true,
    message: "Complaint registered successfully",
    complaint: complaint.toSafeObject()
  })
}

/**
 * @desc    Get all complaints with optional filtering
 * @route   GET /api/complaints
 * @access  Public / Authenticated
 */
export async function getComplaints(req, res) {
  const { status, category, search, my } = req.query
  const filter = {}

  // Filter by user's own reports if requested
  if (my === "true" && req.user) {
    filter.user = req.user._id
  }

  // Filter by status
  if (status && status !== "all") {
    filter.status = new RegExp(`^${status.trim()}$`, "i")
  }

  // Filter by category
  if (category && category !== "all") {
    filter.$or = [
      { category: new RegExp(category.trim(), "i") },
      { categoryKey: new RegExp(category.trim(), "i") }
    ]
  }

  // Search query in title, complaintId, or location
  if (search && search.trim()) {
    const q = search.trim()
    filter.$or = [
      { title: new RegExp(q, "i") },
      { complaintId: new RegExp(q, "i") },
      { location: new RegExp(q, "i") }
    ]
  }

  const complaints = await Complaint.find(filter)
    .sort({ createdAt: -1 })
    .populate("user", "name email profileImage role")

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints: complaints.map((c) => c.toSafeObject())
  })
}

/**
 * @desc    Get current user's submitted complaints
 * @route   GET /api/complaints/my
 * @access  Private (Authenticated Citizen)
 */
export async function getMyComplaints(req, res) {
  const complaints = await Complaint.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("user", "name email profileImage role")

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints: complaints.map((c) => c.toSafeObject())
  })
}

/**
 * @desc    Get single complaint by ID (complaintId or _id)
 * @route   GET /api/complaints/:id
 * @access  Public
 */
export async function getComplaintById(req, res) {
  const { id } = req.params

  let complaint = await Complaint.findOne({ complaintId: id.toUpperCase() })
    .populate("user", "name email profileImage role")

  // Fallback to MongoDB _id if not found by complaintId
  if (!complaint && id.match(/^[0-9a-fA-F]{24}$/)) {
    complaint = await Complaint.findById(id).populate("user", "name email profileImage role")
  }

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: `No complaint found with ID "${id}"`
    })
  }

  res.status(200).json({
    success: true,
    complaint: complaint.toSafeObject()
  })
}

/**
 * @desc    Update complaint status & timeline
 * @route   PATCH /api/complaints/:id/status
 * @access  Private
 */
export async function updateComplaintStatus(req, res) {
  const { id } = req.params
  const { status, remarks = "", assignedOfficer } = req.body

  let complaint = await Complaint.findOne({ complaintId: id.toUpperCase() })
  if (!complaint && id.match(/^[0-9a-fA-F]{24}$/)) {
    complaint = await Complaint.findById(id)
  }

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: `Complaint not found with ID "${id}"`
    })
  }

  const validStatuses = ["Submitted", "Under Review", "In Progress", "Resolved", "Rejected"]
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    })
  }

  complaint.status = status
  complaint.statusKey = status.toLowerCase().replace(/\s+/g, "_")
  if (assignedOfficer) {
    complaint.assignedOfficer = assignedOfficer
  }

  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })

  // Update matching timeline stage to done
  complaint.timeline = complaint.timeline.map((stage) => {
    if (stage.status.toLowerCase() === status.toLowerCase()) {
      return {
        ...stage,
        done: true,
        date: formattedDate,
        adminRemarks: remarks || stage.adminRemarks
      }
    }
    return stage
  })

  // Append official remark if remarks are provided
  if (remarks) {
    complaint.officialRemarks.push({
      id: `rem-${Date.now()}`,
      author: req.user?.name || "MCC Engineering Officer",
      role: "Field Operations",
      date: `${formattedDate}, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      message: remarks
    })
  }

  await complaint.save()

  res.status(200).json({
    success: true,
    message: `Complaint status updated to ${status}`,
    complaint: complaint.toSafeObject()
  })
}

/**
 * @desc    Upvote a civic complaint
 * @route   POST /api/complaints/:id/upvote
 * @access  Private
 */
export async function upvoteComplaint(req, res) {
  const { id } = req.params

  let complaint = await Complaint.findOne({ complaintId: id.toUpperCase() })
  if (!complaint && id.match(/^[0-9a-fA-F]{24}$/)) {
    complaint = await Complaint.findById(id)
  }

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: `Complaint not found`
    })
  }

  const userId = req.user._id
  const hasUpvoted = complaint.upvotedBy.some((uid) => uid.toString() === userId.toString())

  if (hasUpvoted) {
    complaint.upvotedBy = complaint.upvotedBy.filter((uid) => uid.toString() !== userId.toString())
    complaint.upvotes = Math.max(1, complaint.upvotes - 1)
  } else {
    complaint.upvotedBy.push(userId)
    complaint.upvotes += 1
  }

  await complaint.save()

  res.status(200).json({
    success: true,
    upvotes: complaint.upvotes,
    hasUpvoted: !hasUpvoted
  })
}
