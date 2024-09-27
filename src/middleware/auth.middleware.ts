import { NextFunction, Response } from "express"
import * as jwt from "jsonwebtoken"
import "dotenv/config"

export const auth = (req: any, res: Response, next: NextFunction) => {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const token = header.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET || "")
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  req["currentUser"] = decode
  next()
}
