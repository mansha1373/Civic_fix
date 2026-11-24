import jwt from "jsonwebtoken"
import User from "../models/User.js"

/**
 * Authentication Middleware
 * Verifies JWT from HTTP-only cookie OR Authorization header (Bearer token)
 * Attaches the authenticated user to req.user and req.userId
 */
export async function protect(req, res, next) {
  let token

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt
  }
  // 2. Check Authorization header (Bearer <token>) as fallback
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no authentication token provided"
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "civicfix_secret_jwt_key_fallback_32char"
    )

    // Find user by ID decoded from token, excluding password hash
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user account no longer exists"
      })
    }

    req.user = user
    req.userId = user._id
    req.userRole = user.role
    next()
  } catch (error) {
    console.error("[Auth Middleware Error]", error.message)

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again."
      })
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token"
    })
  }
}

/**
 * Optional Authentication Middleware
 * If a token is provided in cookies or headers, validates and attaches req.user.
 * If no token is provided, proceeds without error.
 */
export async function optionalAuth(req, res, next) {
  let token

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "civicfix_secret_jwt_key_fallback_32char"
    )
    const user = await User.findById(decoded.id).select("-password")
    if (user) {
      req.user = user
      req.userId = user._id
      req.userRole = user.role
    }
  } catch {
    // Ignore invalid optional token
  }

  next()
}
