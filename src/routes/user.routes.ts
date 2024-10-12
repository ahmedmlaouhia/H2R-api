import express from "express"
import { UserController } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"
import { authorization } from "../middleware/authorization"

const router = express.Router()
router.post(
  "/create",
  auth,
  authorization(["HR", "Admin"]),
  UserController.create
)
router.get("/", auth, authorization(["Admin"]), UserController.getAll)
router.get(
  "/employees",
  auth,
  authorization(["HR", "Admin"]),
  UserController.getEmployees
)

router.get("/hr", auth, authorization(["Admin"]), UserController.getHR)
router.get(
  "/employees/count",
  auth,
  authorization(["HR", "Admin"]),
  UserController.getEmployeesCount
)
router.get(
  "/hr/count",
  auth,
  authorization(["Admin"]),
  UserController.getHRCount
)

router.put(
  "/makeEmployee/:id",
  auth,
  authorization(["Admin"]),
  UserController.makeEmployee
)
router.put("/makehr/:id", auth, authorization(["Admin"]), UserController.makeHR)
router.put("/updateProfile", auth, UserController.updateProfile)
router.put(
  "/update/:id",
  auth,
  authorization(["Admin"]),
  UserController.updateUser
)
router.delete(
  "/delete/:id",
  auth,
  authorization(["Admin"]),
  UserController.deleteUser
)

router.get("/leave/balance", auth, UserController.getMyLeaveBalance)

export default router
