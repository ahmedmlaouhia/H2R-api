import { Request, Response } from "express"
import { encrypt } from "../helpers/helpers"
import { User } from "../schemas/User"

export class UserController {
  static async signup(req: Request, res: Response) {
    const { name, email, password, role } = req.body
    const encryptedPassword = await encrypt.encryptpass(password)
    const user = new User()
    user.name = name
    user.email = email
    user.password = encryptedPassword
    user.role = role
    await User.save(user)
    const token = encrypt.generateToken({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    return res
      .status(200)
      .json({ message: "User created successfully", token, user })
  }

  static async getUsers(req: Request, res: Response) {
    const users = await User.find()
    return res.status(200).json({
      data: users,
    })
  }

  static async updateUser(req: Request, res: Response) {
    const id = Number(req.params)
    const { name, email } = req.body
    const user = await User.findOneBy({ id: id })
    if (user) {
      user.name = name
      user.email = email
      await User.save(user)
      res.status(200).json({ message: "udpdate", user })
    } else {
      res.status(404).json("User not found")
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const id = Number(req.params)
    const user = await User.findOneBy({
      id: id,
    })
    if (user) {
      await User.remove(user)
      res.status(200).json({ message: "ok" })
    }
  }
}
