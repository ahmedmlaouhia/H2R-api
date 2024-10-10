import express from "express"
import { UserController } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"
import { authorization } from "../middleware/authorization"

const router = express.Router()
router.get("/", auth, authorization(["admin"]), UserController.getAll)
router.post("/signup", UserController.signup)
router.get(
  "/users",
  auth,
  authorization(["HR", "admin"]),
  UserController.getUsers
)
router.get("/hr", auth, authorization(["admin"]), UserController.getHR)
router.put(
  "/role/:id",
  auth,
  authorization(["admin"]),
  UserController.updateRole
)
router.put("/update/my", auth, UserController.updateProfile)
router.delete(
  "/delete/:id",
  auth,
  authorization(["HR", "admin"]),
  UserController.deleteUser
)

export default router
