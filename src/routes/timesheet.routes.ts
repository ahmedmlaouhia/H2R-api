import express from "express"
import { auth } from "../middleware/auth.middleware"
import { authorization } from "../middleware/authorization"
import { TimesheetController } from "../controllers/timesheet.controller"

const router = express.Router()

router.post(
  "/create",
  auth,
  authorization(["Employee"]),
  TimesheetController.createTimesheetEntry
)

router.get(
  "/",
  auth,
  authorization(["HR", "Admin"]),
  TimesheetController.getAllTimesheets
)

router.get(
  "/my",
  auth,
  authorization(["Employee"]),
  TimesheetController.getMyTimesheets
)

router.put(
  "/validate/:id",
  auth,
  authorization(["HR", "Admin"]),
  TimesheetController.validateTimesheetEntry
)

router.put(
  "/correct/:id",
  auth,
  authorization(["HR", "Admin"]),
  TimesheetController.correctTimesheetEntry
)

router.put(
  "/edit/:id",
  auth,
  authorization(["Employee"]),
  TimesheetController.editTimesheetEntry
)

router.delete(
  "/delete/:id",
  auth,
  authorization(["Employee"]),
  TimesheetController.deleteTimesheetEntry
)

export default router
