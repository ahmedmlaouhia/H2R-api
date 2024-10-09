import { Response, Request } from "express"
import { Leave } from "../schemas/Leave"

export class LeaveController {
  static async createLeave(req: any, res: Response) {
    try {
      const { startDate, endDate, reason } = req.body
      const user = req.authUser
      const leave = new Leave()
      leave.startDate = startDate
      leave.endDate = endDate
      leave.reason = reason
      leave.user = user
      await Leave.save(leave)
      return res.status(201).json({ message: "Leave request created", leave })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  static async getLeaves(req: Request, res: Response) {
    try {
      const leaves = await Leave.find({
        relations: ["user"],
      })

      return res
        .status(200)
        .json({ message: "Leave requests retrieved", leaves })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  static async acceptLeave(req: Request, res: Response) {
    const leaveId = Number(req.params)
    const leave = await Leave.findOneBy({ id: leaveId })

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    leave.status = "Approved"
    await Leave.save(leave)

    return res.status(200).json({
      message: "Leave request approved",
      leave,
    })
  }

  static async refuseLeave(req: Request, res: Response) {
    const leaveId = Number(req.params)
    const leave = await Leave.findOneBy({ id: leaveId })

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    leave.status = "Rejected"
    await Leave.save(leave)

    return res.status(200).json({
      message: "Leave request rejected",
      leave,
    })
  }
}
