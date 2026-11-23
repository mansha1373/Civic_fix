import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address"
      ]
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false // Do not include password in queries by default
    },
    phone: {
      type: String,
      trim: true,
      default: "+91 98765 43210"
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    city: {
      type: String,
      trim: true,
      default: "Chandigarh"
    },
    sector: {
      type: String,
      trim: true,
      default: "Sector 17"
    },
    ward: {
      type: String,
      trim: true,
      default: "Ward No. 4, MCC"
    },
    profileImage: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["citizen"],
      default: "citizen" // Default public registrations to citizen role; prevents admin creation via signup
    }
  },
  {
    timestamps: true
  }
)

// Pre-save hook: Hash password with bcrypt before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Instance method to compare candidate password with stored bcrypt hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Helper method to return clean, safe user representation without sensitive fields
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    _id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    city: this.city,
    sector: this.sector,
    ward: this.ward,
    profileImage: this.profileImage,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

const User = mongoose.model("User", userSchema)
export default User
