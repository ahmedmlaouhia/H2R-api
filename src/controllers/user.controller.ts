import { Request, Response } from "express"
import { encrypt } from "../helpers/helpers"
import { User } from "../schemas/User"

export class UserController {
  static async signup(req: Request, res: Response) {
    const email = req.body.email
    if (await User.findOneBy({ email: email })) {
      return res.status(400).json({ message: "User already exists" })
    }
    const { firstName, lastName, phone, password, role } = req.body
    const encryptedPassword = await encrypt.encryptpass(password)
    const user = new User()
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.phone = phone
    user.password = encryptedPassword
    user.role = role

    await User.save(user)
    const token = encrypt.generateToken({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
    })
    const { password: _, createdAt, updatedAt, ...result } = user
    return res
      .status(200)
      .json({ message: "User created successfully", token, user: result })
  }

  static async getUsers(req: Request, res: Response) {
    const users = await User.find()
    return res.status(200).json({
      data: users,
    })
  }

  static async updateUser(req: Request, res: Response) {
    const id = Number(req.params)
    const { firstName, lastName, email, phone, role } = req.body
    const user = await User.findOneBy({ id: id })
    if (user) {
      user.firstName = firstName
      user.lastName = lastName
      user.phone = phone
      user.email = email
      user.role = role
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
