import { validationResult } from "express-validator"
import User from "../models/User.js"
import { generateToken, setTokenCookie } from "../utils/generateToken.js"

/**
 * @desc    Register a new citizen account
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function registerUser(req, res) {
  // Validate request inputs using express-validator
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    })
  }

  const { name, email, password } = req.body

  const normalizedEmail = email.trim().toLowerCase()

  // Check if user already exists
  const userExists = await User.findOne({ email: normalizedEmail })
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "An account with this email already exists. Try logging in."
    })
  }

  // Create new user (role is forced to citizen in schema default)
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password, // Handled and hashed by User pre-save hook
    role: "citizen"
  })

  // Generate JWT token and set HTTP-only cookie
  const token = generateToken(user._id, user.role)
  setTokenCookie(res, token)

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token, // Also return token for environments where cookies are blocked
    user: user.toSafeObject()
  })
}

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function loginUser(req, res) {
  // Validate request inputs
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    })
  }

  const { email, password } = req.body

  const normalizedEmail = email.trim().toLowerCase()

  // Find user by email and explicitly include password field
  const user = await User.findOne({ email: normalizedEmail }).select("+password")

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password. Please verify your credentials."
    })
  }

  // Compare submitted password with bcrypt hash
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password. Please verify your credentials."
    })
  }

  // Generate JWT token and set HTTP-only cookie
  const token = generateToken(user._id, user.role)
  setTokenCookie(res, token)

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: user.toSafeObject()
  })
}

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export async function getMe(req, res) {
  // req.user is attached by protect middleware
  res.status(200).json({
    success: true,
    user: req.user.toSafeObject ? req.user.toSafeObject() : req.user
  })
}

/**
 * @desc    Log out user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export async function logoutUser(req, res) {
  const isProd = process.env.NODE_ENV === "production"

  // Invalidate HTTP-only cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: isProd,
    sameSite: isProd ? "none" : "lax"
  })

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
}
