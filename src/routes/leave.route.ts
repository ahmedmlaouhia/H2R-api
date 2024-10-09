import express from "express";
import { auth } from "../middleware/auth.middleware";
import { authorization } from "../middleware/authorization";
import { LeaveController } from "../controllers/leave.controller";

const router = express.Router();

router.post("/create", auth, authorization(["user", "admin"]), LeaveController.createLeave);
router.get("/", auth, authorization(["user"]), LeaveController.getLeaves);
router.put("/approve/:id", auth, authorization(["admin"]), LeaveController.acceptLeave);
router.put("/reject/:id", auth, authorization(["admin"]), LeaveController.refuseLeave);

export default router;
