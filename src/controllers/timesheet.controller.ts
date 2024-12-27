import { Response, Request } from "express"
import { Timesheet } from "../schemas/Timesheet"
import { User } from "../schemas/User"
import { Notification } from "../schemas/Notification"

export class TimesheetController {
  static async createTimesheetEntry(req: any, res: Response) {
    try {
      const { date, hours } = req.body
      if (!date || !hours) {
        return res.status(400).json({ message: "Date and hours are required" })
      }
      if (hours <= 0 || hours > 24) {
        return res
          .status(400)
          .json({ message: "Hours must be between 1 and 24" })
      }
      const userId = req.authUser.id
      const user = await User.findOneBy({ id: userId })
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const timesheet = new Timesheet()
      timesheet.date = date
      timesheet.hours = hours
      timesheet.user = user
      await Timesheet.save(timesheet)

      return res
        .status(201)
        .json({ message: "Timesheet entry created successfully" })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  static async getAllTimesheets(req: Request, res: Response) {
    try {
      const timesheets = await Timesheet.find({ relations: ["user"] })
      const data = timesheets.map(timesheet => {
        const { user, ...rest } = timesheet
        const { password: _, ...result } = user
        return { ...rest, user: result }
      })
      return res.status(200).json({ timesheets: data })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  static async getMyTimesheets(req: any, res: Response) {
    const userId = req.authUser.id
    const user = await User.findOne({
      where: { id: userId },
      relations: {
        timesheets: true,
      },
    })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json({ timesheets: user.timesheets })
  }

  static async validateTimesheetEntry(req: Request, res: Response) {
    const timesheetId = req.params.id
    const timesheet = await Timesheet.findOne({
      where: { id: timesheetId },
      relations: ["user"],
    })

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet entry not found" })
    }

    if (timesheet.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Timesheet is already " + timesheet.status })
    }

    // Update the timesheet status (e.g., Approved or Rejected)
    timesheet.status = "Approved" // Change this logic as per your requirement
    await Timesheet.save(timesheet)

    // Create a notification for the user
    const notification = new Notification()
    notification.user = timesheet.user
    notification.title = "Timesheet Approved" // Adjust the title based on your logic
    notification.message = `Your timesheet entry for ${timesheet.date} has been approved.` // Adjust the message
    await Notification.save(notification)

    return res
      .status(200)
      .json({ message: "Timesheet entry validated successfully" })
  }

  static async correctTimesheetEntry(req: Request, res: Response) {
    const timesheetId = req.params.id
    const { hours, description } = req.body

    const timesheet = await Timesheet.findOneBy({ id: timesheetId })

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet entry not found" })
    }

    if (hours && (hours <= 0 || hours > 24)) {
      return res.status(400).json({ message: "Hours must be between 1 and 24" })
    }

    timesheet.hours = hours || timesheet.hours
    timesheet.status = "Corrected"

    await Timesheet.save(timesheet)

    return res.status(200).json({ message: "Timesheet entry corrected" })
  }

  static async editTimesheetEntry(req: Request, res: Response) {
    const timesheetId = req.params.id
    const { date, hours, description } = req.body

    const timesheet = await Timesheet.findOne({
      where: { id: timesheetId },
      relations: ["user"],
    })

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet entry not found" })
    }

    if (timesheet.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Timesheet is already " + timesheet.status })
    }

    if (hours && (hours <= 0 || hours > 24)) {
      return res.status(400).json({ message: "Hours must be between 1 and 24" })
    }

    timesheet.date = date || timesheet.date
    timesheet.hours = hours || timesheet.hours

    await Timesheet.save(timesheet)

    return res.status(200).json({ message: "Timesheet entry updated" })
  }

  static async deleteTimesheetEntry(req: Request, res: Response) {
    const timesheetId = req.params.id
    const timesheet = await Timesheet.findOneBy({ id: timesheetId })

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet entry not found" })
    }

    await Timesheet.remove(timesheet)

    return res.status(200).json({ message: "Timesheet entry deleted" })
  }
}
