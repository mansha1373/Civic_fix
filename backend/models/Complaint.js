import mongoose from "mongoose"

const officialRemarkSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => `rem-${Date.now()}` },
    author: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true },
    message: { type: String, required: true }
  },
  { _id: false }
)

const timelineStageSchema = new mongoose.Schema(
  {
    stage: { type: String, required: true },
    status: { type: String, required: true },
    step: { type: String, required: true },
    date: { type: String, required: true },
    done: { type: Boolean, default: false },
    desc: { type: String, default: "" },
    adminRemarks: { type: String, default: "" }
  },
  { _id: false }
)

const resolutionSchema = new mongoose.Schema(
  {
    beforeImage: { type: String, default: "" },
    afterImage: { type: String, default: "" },
    date: { type: String, default: "" },
    description: { type: String, default: "" },
    verifiedBy: { type: String, default: "" }
  },
  { _id: false }
)

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: [true, "Complaint ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"],
      index: true
    },
    title: {
      type: String,
      required: [true, "Please provide an issue title"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [150, "Title cannot exceed 150 characters"]
    },
    description: {
      type: String,
      required: [true, "Please provide a detailed issue description"],
      trim: true,
      minlength: [15, "Description must be at least 15 characters long"],
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    category: {
      type: String,
      required: [true, "Please select an issue category"],
      trim: true
    },
    categoryKey: {
      type: String,
      default: "other",
      trim: true
    },
    location: {
      type: String,
      required: [true, "Please provide the issue location or landmark"],
      trim: true,
      minlength: [3, "Location must be at least 3 characters long"]
    },
    coordinates: {
      lat: { type: Number, default: 30.7415 },
      lng: { type: Number, default: 76.7794 }
    },
    pincode: {
      type: String,
      default: "160017",
      trim: true
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "High"
    },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "In Progress", "Resolved", "Rejected"],
      default: "Submitted",
      index: true
    },
    statusKey: {
      type: String,
      default: "submitted"
    },
    department: {
      type: String,
      default: "Municipal Corporation",
      trim: true
    },
    assignedOfficer: {
      type: String,
      default: "Pending Field Verification",
      trim: true
    },
    estimatedResolution: {
      type: String,
      default: "Within 3-5 business days"
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
    },
    images: {
      type: [String],
      default: []
    },
    photoCount: {
      type: Number,
      default: 1
    },
    upvotes: {
      type: Number,
      default: 1
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    officialRemarks: {
      type: [officialRemarkSchema],
      default: []
    },
    timeline: {
      type: [timelineStageSchema],
      default: []
    },
    resolution: {
      type: resolutionSchema,
      default: () => ({})
    },
    isUserCreated: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// Compound text index for search by title, complaintId, and location
complaintSchema.index({
  title: "text",
  description: "text",
  location: "text",
  complaintId: "text"
})

// Transform to safe object matching both Citizen & Admin dashboard expectations
complaintSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  const isPopulatedUser = this.user && typeof this.user === "object" && this.user.name

  const citizenObj = isPopulatedUser
    ? {
        id: this.user._id ? this.user._id.toString() : this.user.id,
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone || "+91 98000 00000",
        avatar: this.user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        address: this.user.address || this.user.sector || "Sector 17, Chandigarh"
      }
    : {
        name: "Verified Citizen",
        email: "citizen@civicfix.in",
        phone: "+91 98000 00000",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        address: "Sector 17, Chandigarh"
      }

  const rawLocation = this.location || "Sector 17, Chandigarh"
  const locationObj = {
    address: rawLocation,
    sector: rawLocation.toLowerCase().includes("sector")
      ? rawLocation.split(",")[0].trim()
      : "Sector 17"
  }

  return {
    ...obj,
    id: this.complaintId,
    _id: this._id.toString(),
    complaintId: this.complaintId,
    userId: this.user ? (this.user._id ? this.user._id.toString() : this.user.toString()) : null,
    citizen: citizenObj,
    location: rawLocation,
    rawLocation: rawLocation,
    locationObj: locationObj,
    address: rawLocation,
    sector: locationObj.sector,
    priority: this.urgency || "High",
    urgency: this.urgency || "High",
    submissionDate: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
    date: this.createdAt
      ? new Date(this.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      : "Recent",
    submittedDate: this.createdAt
      ? new Date(this.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      : "Recent",
    lastUpdated: this.updatedAt
      ? new Date(this.updatedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      : "Recent",
    time: this.createdAt
      ? new Date(this.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "10:00 AM"
  }
}

const Complaint = mongoose.model("Complaint", complaintSchema)
export default Complaint
