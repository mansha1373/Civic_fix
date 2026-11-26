import express from "express"
import {
  getAdminStats,
  getAdminCitizens,
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification
} from "../controllers/adminController.js"
import { protect, requireAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

// All administrative endpoints strictly enforce authentication & admin role
router.use(protect, requireAdmin)

router.get("/stats", getAdminStats)
router.get("/citizens", getAdminCitizens)
router.get("/notifications", getAdminNotifications)
router.patch("/notifications/read-all", markAllAdminNotificationsRead)
router.patch("/notifications/:id/read", markAdminNotificationRead)
router.delete("/notifications/:id", deleteAdminNotification)

export default router
