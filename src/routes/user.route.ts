import express from "express"
import { UserController } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"
import { authorization } from "../middleware/authorization"
import { AuthController } from "../controllers/auth.controller"

const router = express.Router()
router.get("/", auth, authorization(["admin"]), UserController.getUsers)
router.get(
  "/profile",
  auth,
  authorization(["user", "admin"]),
  AuthController.getProfile
)
router.post("/signup", UserController.signup)
router.post("/login", AuthController.login)
router.put(
  "/update/:id",
  auth,
  authorization(["user", "admin"]),
  UserController.updateUser
)
router.delete(
  "/delete/:id",
  auth,
  authorization(["admin"]),
  UserController.deleteUser
)

export default router
