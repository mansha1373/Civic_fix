import jwt from "jsonwebtoken"

/**
 * Generate a signed JWT token
 * @param {string} userId - User's MongoDB ObjectId
 * @param {string} role - User's role
 * @returns {string} Signed JWT
 */
export function generateToken(userId, role = "citizen") {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "civicfix_secret_jwt_key_fallback_32char",
    {
      expiresIn: "7d"
    }
  )
}

/**
 * Configure and attach HTTP-Only Cookie with the JWT token
 * @param {Response} res - Express response object
 * @param {string} token - Signed JWT
 */
export function setTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production"

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProd, // Only send over HTTPS in production
    sameSite: isProd ? "none" : "lax", // Allow cross-site cookies in prod if frontend/backend separated
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  })
}

export default generateToken
