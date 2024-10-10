import express from "express"
import { UserController } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"
import { authorization } from "../middleware/authorization"

const router = express.Router()
router.post(
  "/create",
  auth,
  authorization(["HR", "admin"]),
  UserController.create
)
router.get("/", auth, authorization(["admin"]), UserController.getAll)
router.get(
  "/users",
  auth,
  authorization(["HR", "admin"]),
  UserController.getUsers
)

router.get("/hr", auth, authorization(["admin"]), UserController.getHR)
router.get(
  "/users/count",
  auth,
  authorization(["HR", "admin"]),
  UserController.getSimpleUserCount
)
router.get(
  "/hr/count",
  auth,
  authorization(["admin"]),
  UserController.getHRCount
)
router.put(
  "/role/:id",
  auth,
  authorization(["admin"]),
  UserController.updateRole
)
router.put("/updateProfile", auth, UserController.updateProfile)
router.delete(
  "/delete/:id",
  auth,
  authorization(["HR", "admin"]),
  UserController.deleteUser
)

router.get("/leave/balance", auth, UserController.getMyLeaveBalance)

export default router
