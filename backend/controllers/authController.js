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

  // Ensure citizen portal only authenticates citizen accounts
  if (user.role !== "citizen") {
    return res.status(403).json({
      success: false,
      message: "This portal is for citizen accounts only. Please use the Admin Login portal."
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
 * @desc    Update authenticated citizen profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export async function updateProfile(req, res) {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    })
  }

  const { name, phone, address, city, sector, ward, bio, profileImage } = req.body

  if (name && name.trim().length >= 2) user.name = name.trim()
  if (phone !== undefined) user.phone = String(phone).trim()
  if (address !== undefined) user.address = String(address).trim()
  if (city !== undefined) user.city = String(city).trim()
  if (sector !== undefined) user.sector = String(sector).trim()
  if (ward !== undefined) user.ward = String(ward).trim()
  if (bio !== undefined) user.bio = String(bio).trim()
  if (profileImage !== undefined) user.profileImage = String(profileImage).trim()

  await user.save()

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: user.toSafeObject()
  })
}

/**
 * @desc    Update citizen preferences and settings
 * @route   PUT /api/auth/settings
 * @access  Private
 */
export async function updateSettings(req, res) {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    })
  }

  const { emailAlerts, smsUpdates, weeklyDigest, language, locationPrivacy } = req.body

  user.settings = {
    emailAlerts: emailAlerts !== undefined ? Boolean(emailAlerts) : user.settings?.emailAlerts ?? true,
    smsUpdates: smsUpdates !== undefined ? Boolean(smsUpdates) : user.settings?.smsUpdates ?? true,
    weeklyDigest: weeklyDigest !== undefined ? Boolean(weeklyDigest) : user.settings?.weeklyDigest ?? false,
    language: language ? String(language).trim() : user.settings?.language ?? "en",
    locationPrivacy: locationPrivacy !== undefined ? Boolean(locationPrivacy) : user.settings?.locationPrivacy ?? true
  }

  await user.save()

  res.status(200).json({
    success: true,
    message: "Settings saved successfully",
    settings: user.settings
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

/**
 * @desc    Authenticate administrator & return JWT token
 * @route   POST /api/auth/admin-login
 * @access  Public
 */
export async function loginAdmin(req, res) {
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

  const user = await User.findOne({ email: normalizedEmail }).select("+password")
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid administrator credentials."
    })
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid administrator credentials."
    })
  }

  // Strictly verify admin role
  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Account does not possess administrator privileges."
    })
  }

  const token = generateToken(user._id, user.role)
  setTokenCookie(res, token)

  res.status(200).json({
    success: true,
    message: "Administrator login successful",
    token,
    user: user.toSafeObject()
  })
}

