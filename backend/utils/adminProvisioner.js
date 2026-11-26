import User from "../models/User.js"
import dotenv from "dotenv"

dotenv.config()

/**
 * Ensures at least one authorized administrator exists in MongoDB Atlas.
 * Never stores plain text - uses bcrypt hashing via User model pre-save hook.
 */
export async function autoProvisionAdmin() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin.vandana@civicfix.gov").trim().toLowerCase()
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
    const adminName = process.env.ADMIN_NAME || "Dr. Vandana Rao"

    const existingAdmin = await User.findOne({ email: adminEmail })

    if (!existingAdmin) {
      console.log(`[Admin Provisioner] Provisioning authorized admin account (${adminEmail})...`)
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword, // Hashed by User model pre-save hook with bcrypt
        role: "admin",
        phone: "+91 172 274000",
        address: "Municipal Corporation Administration, Sector 17",
        city: "Chandigarh",
        sector: "Sector 17",
        ward: "MCC Central Command"
      })
      console.log(`[Admin Provisioner] ✔ Administrator '${adminName}' successfully provisioned in MongoDB.`)
    } else if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin"
      await existingAdmin.save()
      console.log(`[Admin Provisioner] ✔ Updated existing user '${adminEmail}' with role: 'admin'.`)
    }
  } catch (err) {
    console.error(`[Admin Provisioner Error]:`, err.message)
  }
}
