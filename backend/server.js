import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Security headers with Helmet
app.use(helmet())

// Cross-Origin Resource Sharing (CORS) Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(null, true) // permissive for local dev
      }
    },
    credentials: true, // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
)

// Body parsers & Cookie parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

// Rate limiting for Authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests from this IP. Please try again after 15 minutes."
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "CivicFix Backend API",
    timestamp: new Date().toISOString()
  })
})

// Mount Auth routes with rate limiting
app.use("/api/auth", authLimiter, authRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Server initialization function
export async function startServer() {
  try {
    // Connect to MongoDB before accepting incoming requests
    await connectDB()

    const server = app.listen(PORT, () => {
      console.log(`[CivicFix Server] Running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
    })

    return { app, server }
  } catch (error) {
    console.error(`[Server Startup Failed] ${error.message}`)
    process.exit(1)
  }
}

// Start server when run directly
if (process.env.NODE_ENV !== "test" && import.meta.url === `file://${process.argv[1]}`) {
  startServer()
}

export default app
