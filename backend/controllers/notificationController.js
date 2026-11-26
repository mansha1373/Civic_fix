import Notification from "../models/Notification.js"

/**
 * @desc    Get authenticated citizen's notifications
 * @route   GET /api/notifications
 * @access  Private (Citizen / Admin)
 */
export async function getMyNotifications(req, res) {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    read: false
  })

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    notifications: notifications.map((n) => n.toSafeObject())
  })
}

/**
 * @desc    Mark a specific notification as read or unread
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
export async function markNotificationAsRead(req, res) {
  const { id } = req.params
  const { read = true } = req.body

  const notification = await Notification.findOne({
    _id: id,
    user: req.user._id
  })

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found or access denied"
    })
  }

  notification.read = Boolean(read)
  await notification.save()

  res.status(200).json({
    success: true,
    notification: notification.toSafeObject()
  })
}

/**
 * @desc    Mark all user's notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
export async function markAllNotificationsAsRead(req, res) {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  )

  res.status(200).json({
    success: true,
    message: "All notifications marked as read"
  })
}

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export async function deleteNotification(req, res) {
  const { id } = req.params

  const notification = await Notification.findOneAndDelete({
    _id: id,
    user: req.user._id
  })

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found or access denied"
    })
  }

  res.status(200).json({
    success: true,
    message: "Notification removed successfully"
  })
}
