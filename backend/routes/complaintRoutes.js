import express from "express"
import { body } from "express-validator"
import {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  upvoteComplaint
} from "../controllers/complaintController.js"
import { protect, optionalAuth } from "../middleware/authMiddleware.js"

const router = express.Router()

// Validation rules for submitting a complaint
const createComplaintValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Please provide an issue title")
    .isLength({ min: 5, max: 150 })
    .withMessage("Title must be between 5 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Please provide a detailed description")
    .isLength({ min: 15, max: 2000 })
    .withMessage("Description must be between 15 and 2000 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Please select an issue category"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Please provide the issue location or landmark")
    .isLength({ min: 3 })
    .withMessage("Location must be at least 3 characters")
]

// Routes
router.post("/", protect, createComplaintValidation, createComplaint)
router.get("/", optionalAuth, getComplaints)
router.get("/my", protect, getMyComplaints)
router.get("/:id", getComplaintById)
router.patch("/:id/status", protect, updateComplaintStatus)
router.post("/:id/upvote", protect, upvoteComplaint)

export default router
