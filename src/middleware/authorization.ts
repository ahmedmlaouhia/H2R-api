import { NextFunction, Response } from "express"
import { User } from "../schemas/User"

export const authorization = (roles: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const user = await User.findOne({
      where: { id: req[" currentUser"].id },
    })
    if (user && !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" })
    }
    next()
  }
}
