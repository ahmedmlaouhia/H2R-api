import express from "express"
import { auth } from "../middleware/auth.middleware"
import { authorization } from "../middleware/authorization"
import { LeaveController } from "../controllers/leave.controller"

const router = express.Router()

router.post("/create", auth, LeaveController.createLeave)
router.get("/", auth, authorization(["HR", "Admin"]), LeaveController.getLeaves)
router.get("/my", auth, LeaveController.getMyLeaves)
//getLeaveCount
router.get(
  "/stats",
  auth,
  authorization(["HR", "Admin"]),
  LeaveController.getLeaveCount
)

router.get("/Employeestats", auth, LeaveController.getLeaveCountByEmployee)
router.put(
  "/approve/:id",
  auth,
  authorization(["HR", "Admin"]),
  LeaveController.approveLeave
)
router.put(
  "/reject/:id",
  auth,
  authorization(["HR", "Admin"]),
  LeaveController.refuseLeave
)

router.put(
  "/cancel/:id",
  auth,
  authorization(["Employee"]),
  LeaveController.cancelLeave
)

router.put(
  "/edit/:id",
  auth,
  authorization(["Employee"]),
  LeaveController.editLeave
)

export default router
