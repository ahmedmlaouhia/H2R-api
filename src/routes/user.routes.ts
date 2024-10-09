import express from "express"
import { UserController } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"
import { authorization } from "../middleware/authorization"
import { AuthController } from "../controllers/auth.controller"

const router = express.Router()
router.get("/", auth, authorization(["admin"]), UserController.getUsers)
router.post("/signup", UserController.signup)
router.put(
  "/update/:id",
  auth,
  authorization(["user", "HR", "admin"]),
  UserController.updateUser
)
router.delete(
  "/delete/:id",
  auth,
  authorization(["HR", "admin"]),
  UserController.deleteUser
)

export default router
