import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },
    targetRole: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen",
      index: true
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
      index: true
    },
    complaintId: {
      type: String,
      default: "",
      trim: true
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true
    },
    type: {
      type: String,
      enum: ["submission", "review", "progress", "resolved", "rejected", "update", "system"],
      default: "update"
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
)

notificationSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  const createdAt = this.createdAt || new Date()
  return {
    ...obj,
    id: this._id.toString(),
    _id: this._id.toString(),
    userId: this.user ? this.user.toString() : null,
    reportId: this.complaintId || (this.complaint ? this.complaint.toString() : ""),
    targetRole: this.targetRole || "citizen",
    timestamp: createdAt.toISOString(),
    time: createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    date: createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  }
}

const Notification = mongoose.model("Notification", notificationSchema)
export default Notification
