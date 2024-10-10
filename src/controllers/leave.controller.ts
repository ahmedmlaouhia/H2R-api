import { Response, Request } from "express"
import { Leave } from "../schemas/Leave"
import { UserController } from "./user.controller"

export class LeaveController {
  static async createLeave(req: any, res: Response) {
    try {
      const { startDate, endDate, reason } = req.body

      //check the date
      if (new Date(startDate) > new Date(endDate))
        return res.status(400).json({ message: "Invalid date range" })

      //check if the user has a leave request for the same date range
      const user = req.authUser
      const leaveRequest = await Leave.findOneBy({
        user,
        startDate,
        endDate,
      })
      if (leaveRequest)
        return res.status(400).json({
          message: "You already have a leave request for the same date range",
        })

      //check check leave balance
      const leaveBalance = UserController.getLeaveBalance(user)
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
      if (days > leaveBalance)
        return res.status(400).json({
          message: "Insufficient leave balance",
        })

      //create a new leave request
      const leave = new Leave()
      leave.startDate = startDate
      leave.endDate = endDate
      leave.reason = reason
      leave.user = user
      await Leave.save(leave)
      return res.status(201).json({ data: leave })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  static async getLeaves(req: Request, res: Response) {
    try {
      const leaves = await Leave.find({
        relations: ["user"],
      })

      return res.status(200).json({ data: leaves })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  static async getMyLeaves(req: any, res: Response) {
    const user = req.authUser
    const leaves = await Leave.find({
      where: { user },
    })
    return res.status(200).json({ data: leaves })
  }

  static async acceptLeave(req: Request, res: Response) {
    const leaveId = Number(req.params)
    const leave = await Leave.findOneBy({ id: leaveId })
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }
    leave.status = "Approved"
    await Leave.save(leave)
    return res.status(200)
  }

  static async refuseLeave(req: Request, res: Response) {
    const leaveId = Number(req.params)
    const leave = await Leave.findOneBy({ id: leaveId })

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    leave.status = "Rejected"
    await Leave.save(leave)
    return res.status(200)
  }
}
