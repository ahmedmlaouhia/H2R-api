import { NextFunction, Response } from "express"
import * as jwt from "jsonwebtoken"
import "dotenv/config"

export const auth = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers["token"]
  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET || "")
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  req["authUser"] = decode // Rename currentUser to authUser
  next()
}
