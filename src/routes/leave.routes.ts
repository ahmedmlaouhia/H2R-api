import express from "express"
import { auth } from "../middleware/auth.middleware"
import { authorization } from "../middleware/authorization"
import { LeaveController } from "../controllers/leave.controller"

const router = express.Router()

router.post("/create", auth, LeaveController.createLeave)
router.get("/", auth, authorization(["HR", "admin"]), LeaveController.getLeaves)
router.get("/my", auth, LeaveController.getMyLeaves)
//getLeaveCount
router.get(
  "/stats",
  auth,
  authorization(["HR", "admin"]),
  LeaveController.getLeaveCount
)
//getLeaveCountByUser
router.get("/user/stats", auth, LeaveController.getLeaveCountByUser)
router.put(
  "/approve/:id",
  auth,
  authorization(["HR", "admin"]),
  LeaveController.approveLeave
)
router.put(
  "/reject/:id",
  auth,
  authorization(["HR", "admin"]),
  LeaveController.refuseLeave
)

export default router
