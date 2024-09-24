import express from "express"
import * as authController from "../controllers/auth.controller"

const router = express.Router()
router.get("/", authController.getAuth)

export default router
