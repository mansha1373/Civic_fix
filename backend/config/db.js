import mongoose from "mongoose"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Connect to MongoDB database
 * Reads connection string from environment variables and handles connection errors
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI

  if (!uri) {
    throw new Error("[MongoDB Atlas] CRITICAL: MONGO_URI is not set in backend/.env")
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    })

    console.log("================================================================================")
    console.log(" [MongoDB Atlas] Connected successfully to Cloud Database!")
    console.log(` [MongoDB Atlas] Cluster Host: ${conn.connection.host}`)
    console.log(` [MongoDB Atlas] Database Name: ${conn.connection.name}`)
    console.log(" [MongoDB Atlas] Direct live connection verified - Atlas is the sole source of truth.")
    console.log("================================================================================")
    return conn
  } catch (error) {
    console.error("================================================================================")
    console.error(` [MongoDB Atlas Connection Failure] Could not connect to Atlas: ${error.message}`)
    console.error(" Please verify that your IP address is whitelisted in MongoDB Atlas Network Access.")
    console.error("================================================================================")
    throw error
  }
}

export default connectDB
