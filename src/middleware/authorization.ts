import { NextFunction, Response } from "express"
import { User } from "../schemas/User"

export const authorization = (roles: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const user = await User.findOneBy({
      id: req["authUser"].id,
    })
    if (!user) return res.status(404).json({ message: "User not found" })
    if (!roles.includes(user.role))
      return res.status(403).json({ message: "Forbidden" })

    next()
  }
}
