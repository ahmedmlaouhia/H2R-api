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

  //get leave balance
  static getMyLeaveBalance(req: any, res: Response) {
    return res.status(200).json({ data: req.authUser.leaveBalance })
  }

  //get leave balance by passing user
  static getLeaveBalance(user: User) {
    return user.leaveBalance
  }

  //get all users
  static async getAll(req: Request, res: Response) {
    const users = await User.find()
    const usersData = users.map(user => {
      const { password, createdAt, updatedAt, ...data } = user
      return data
    })
    return res.status(200).json({
      data: usersData,
    })
  }

  //get users with role user
  static async getUsers(req: Request, res: Response) {
    const users = await User.findBy({ role: "user" })
    const usersData = users.map(user => {
      const { password, createdAt, updatedAt, ...data } = user
      return data
    })
    return res.status(200).json({
      data: usersData,
    })
  }

  //get users with role HR
  static async getHR(req: Request, res: Response) {
    const users = await User.findBy({ role: "HR" })
    const usersData = users.map(user => {
      const { password, createdAt, updatedAt, ...data } = user
      return data
    })
    return res.status(200).json({
      data: usersData,
    })
  }

  static async updateRole(req: Request, res: Response) {
    const id = Number(req.params)
    const { role } = req.body
    const user = await User.findOneBy({ id: id })
    if (user) {
      user.role = role
      await User.save(user)
      res.status(200).json({
        message:
          "updated " + user.firstName + user.lastName + " role to " + role,
      })
    } else {
      res.status(404).json("User not found")
    }
  }

  static async updateProfile(req: any, res: Response) {
    const id = req.authUser.id
    const { firstName, lastName, phone } = req.body
    const user = await User.findOneBy({ id: id })
    if (user) {
      user.firstName = firstName
      user.lastName = lastName
      user.phone = phone
      await User.save(user)
      res
        .status(200)
        .json({
          message:
            "udpdated user " + user.firstName + user.lastName + " profile",
        })
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
