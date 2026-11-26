import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({ path: "./backend/.env" })
dotenv.config()
import { connectDB } from "../config/db.js"
import { autoProvisionAdmin } from "../utils/adminProvisioner.js"

async function runSeed() {
  console.log("==========================================")
  console.log("CIVICFIX: ADMIN ACCOUNT PROVISIONING SCRIPT")
  console.log("==========================================\n")

  try {
    await connectDB()
    await autoProvisionAdmin()
    console.log("\n✔ Admin provisioning complete.")
  } catch (err) {
    console.error("❌ Seeding failed:", err.message)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

runSeed()
