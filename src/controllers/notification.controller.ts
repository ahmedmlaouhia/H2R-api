import { Response, Request } from "express"
import { Notification } from "../schemas/Notification"
import { User } from "../schemas/User"

export class NotificationController {
  // Add a new notification
  static async addNotification(req: any, res: Response) {
    try {
      const { title, message } = req.body
      if (!title || !message) {
        return res
          .status(400)
          .json({ message: "Title and message are required" })
      }

      const userId = req.authUser.id
      const user = await User.findOneBy({ id: userId })
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const notification = new Notification()
      notification.title = title
      notification.message = message
      notification.user = user
      await Notification.save(notification)

      return res
        .status(201)
        .json({ message: "Notification added successfully" })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  // Mark a notification as read
  static async markAsRead(req: Request, res: Response) {
    try {
      const notificationId = req.params.id
      const notification = await Notification.findOneBy({ id: notificationId })

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" })
      }

      if (notification.isRead) {
        return res
          .status(400)
          .json({ message: "Notification is already marked as read" })
      }

      notification.isRead = true
      await Notification.save(notification)

      return res.status(200).json({ message: "Notification marked as read" })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  // Get all notifications for the authenticated user
  static async getNotifications(req: any, res: Response) {
    try {
      const userId = req.authUser.id
      const user = await User.findOne({
        where: { id: userId },
        relations: ["notifications"],
      })

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      return res.status(200).json({ notifications: user.notifications })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }
}
