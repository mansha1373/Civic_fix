import express from "express"
import { body } from "express-validator"
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser
} from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Validation rules for registration
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Please provide your full name")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
]

// Validation rules for login
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Please provide your password")
]

// Routes
router.post("/register", registerValidation, registerUser)
router.post("/login", loginValidation, loginUser)
router.get("/me", protect, getMe)
router.post("/logout", logoutUser)

export default router
