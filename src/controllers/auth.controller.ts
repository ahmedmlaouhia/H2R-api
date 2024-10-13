import { Request, Response } from "express"
import { User } from "../schemas/User"
import { encrypt } from "../helpers/helpers"

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(500).json({ message: " email and password required" })
      }

      const user = await User.findOne({ where: { email } })

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      } else {
        const isPasswordValid = encrypt.comparepassword(user.password, password)
        if (!user || !isPasswordValid) {
          return res.status(404).json({ message: "User not found" })
        }
        const token = encrypt.generateToken({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          leaveBalance: user.leaveBalance,
        })

        const { password: _, createdAt, updatedAt, ...result } = user

        return res
          .status(200)
          .json({ message: "Login successful", token, result })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}
