import mongoose from "mongoose"

/**
 * Connect to MongoDB database
 * Reads connection string from environment variables and handles connection errors
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/civicfix"

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // Fast 3s timeout for local check
    })

    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`)
    return conn
  } catch (error) {
    console.warn(`[MongoDB Notice] Could not connect to primary URI (${uri}): ${error.message}`)

    // If local MongoDB daemon is not running on developer machine, provide embedded MongoDB fallback
    // so the server and authentication work out of the box for testing and evaluation
    try {
      console.log("[MongoDB] Starting embedded MongoDB engine for local demonstration...")
      const { MongoMemoryServer } = await import("mongodb-memory-server")
      const mongod = await MongoMemoryServer.create()
      const memUri = mongod.getUri()
      const conn = await mongoose.connect(memUri)
      console.log(`[MongoDB] Connected to embedded database successfully at: ${memUri}`)
      return conn
    } catch (memErr) {
      console.error(`[MongoDB Fatal Error] Connection failed: ${memErr.message}`)
      throw error
    }
  }
}

export default connectDB
