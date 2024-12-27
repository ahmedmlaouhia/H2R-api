import express from "express"
import { auth } from "../middleware/auth.middleware"
import { NotificationController } from "../controllers/notification.controller"

const router = express.Router()

// Add a new notification
router.post("/add", auth, NotificationController.addNotification)

// Mark a notification as read
router.put("/mark-read/:id", auth, NotificationController.markAsRead)

// Get all notifications for the authenticated user
router.get("/", auth, NotificationController.getNotifications)

export default router
