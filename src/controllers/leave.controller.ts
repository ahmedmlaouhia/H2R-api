import { Response, Request } from "express"
import { Leave } from "../schemas/Leave"
import { UserController } from "./user.controller"
import { User } from "../schemas/User"
import { Notification } from "../schemas/Notification"
import moment from "moment"

export class LeaveController {
  static async createLeave(req: any, res: Response) {
    try {
      const { startDate, endDate, reason } = req.body
      if (!startDate || !endDate || !reason) {
        return res
          .status(400)
          .json({ message: "startDate, endDate and reason are required" })
      }
      if (new Date(startDate) > new Date(endDate))
        return res.status(400).json({ message: "Invalid date range" })
      const userid = req.authUser.id
      const user = await User.findOneBy({ id: userid })
      if (!user) {
        res.status(404).json({ message: "User not found" })
      } else {
        const days =
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 3600 * 24)
          ) + 1
        if (days > user.leaveBalance)
          return res.status(400).json({
            message: "Insufficient leave balance",
          })

        // Create a new leave request
        const leave = new Leave()
        leave.startDate = startDate
        leave.endDate = endDate
        leave.reason = reason
        leave.user = user
        await Leave.save(leave)

        return res
          .status(201)
          .json({ message: "Leave request created successfully" })
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  static async getUserId(leaveId: string) {
    const leave = await Leave.findOne({
      where: { id: leaveId },
      relations: ["user"],
    })
    if (!leave) {
      return null
    }
    return leave.user.id
  }

  static async getLeaves(req: Request, res: Response) {
    try {
      const leaves = await Leave.find({
        relations: ["user"],
      })
      const data = leaves.map(leave => {
        const { user, ...rest } = leave
        const { password: _, createdAt, updatedAt, ...result } = user
        return { ...rest, user: result }
      })
      return res.status(200).json({ leaves: data })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  static async getMyLeaves(req: any, res: Response) {
    const id = req.authUser.id
    const user = await User.findOne({
      where: { id: id },
      relations: {
        leaves: true,
      },
    })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json({ leaves: user.leaves })
  }

  static async getLeaveCount(req: Request, res: Response) {
    const all = await Leave.count()
    const approved = await Leave.countBy({ status: "Approved" })
    const rejected = await Leave.countBy({ status: "Rejected" })
    const pending = await Leave.countBy({ status: "Pending" })
    const leaves = { all, approved, rejected, pending }
    return res.status(200).json({ data: leaves })
  }

  static async getLeaveCountByEmployee(req: any, res: Response) {
    const all = await Leave.countBy({ user: req.authUser })
    const approved = await Leave.countBy({
      user: req.authUser,
      status: "Approved",
    })
    const rejected = await Leave.countBy({
      user: req.authUser,
      status: "Rejected",
    })
    const pending = await Leave.countBy({
      user: req.authUser,
      status: "Pending",
    })
    const leaves = { all, approved, rejected, pending }
    return res.status(200).json({ data: leaves })
  }

  static async approveLeave(req: Request, res: Response) {
    const leaveId = req.params.id
    const leave = await Leave.findOne({
      where: { id: leaveId },
      relations: ["user"],
    })
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }
    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: `Leave request is already ${leave.status}` })
    }
    const user = leave.user
    const days = moment(leave.endDate).diff(moment(leave.startDate), "days") + 1
    if (days > leave.user.leaveBalance) {
      return res.status(400).json({ message: "Insufficient leave balance" })
    }
    leave.status = "Approved"
    await Leave.save(leave)
    const newLeaveBalance = user.leaveBalance - days
    await UserController.updateLeaveBalance(user, newLeaveBalance)

    // Create a notification for the user
    // const notification = new Notification()
    // notification.user = leave.user
    // notification.title = "Leave Approved"
    // notification.message = `Your leave from ${leave.startDate} to ${leave.endDate} has been approved.`
    // await Notification.save(notification)

    return res.status(200).json({ message: "Leave request approved" })
  }

  static async refuseLeave(req: Request, res: Response) {
    const leaveId = req.params.id
    const leave = await Leave.findOneBy({ id: leaveId })

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }
    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: `Leave request is already ${leave.status}` })
    }
    leave.status = "Rejected"
    await Leave.save(leave)

    // Create a notification for the user
    // const notification = new Notification()
    // notification.user = leave.user
    // notification.title = "Leave Rejected"
    // notification.message = `Your leave from ${leave.startDate} to ${leave.endDate} has been rejected.`
    // await Notification.save(notification)

    return res.status(200).json({ message: "Leave request rejected" })
  }

  static async cancelLeave(req: Request, res: Response) {
    const leaveId = req.params.id
    const leave = await Leave.findOneBy({ id: leaveId })

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }
    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: `Leave request is already ${leave.status}` })
    }
    await Leave.remove(leave)
    return res.status(200).json({ message: "Leave request cancelled" })
  }

  static async editLeave(req: Request, res: Response) {
    const leaveId = req.params.id
    const leave = await Leave.findOne({
      where: { id: leaveId },
      relations: ["user"],
    })

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }
    const user = await User.findOneBy({ id: leave.user.id })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: `Leave request is already ${leave.status}` })
    }
    const { startDate, endDate, reason } = req.body
    if (!startDate || !endDate || !reason) {
      return res
        .status(400)
        .json({ message: "startDate, endDate and reason are required" })
    }
    const days =
      Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 3600 * 24)
      ) + 1
    if (days > user.leaveBalance)
      return res.status(400).json({
        message: "Insufficient leave balance",
      })
    if (new Date(startDate) > new Date(endDate))
      return res.status(400).json({ message: "Invalid date range" })

    leave.startDate = startDate
    leave.endDate = endDate
    leave.reason = reason
    await Leave.save(leave)
    return res.status(200).json({ message: "Leave request updated" })
  }
}
