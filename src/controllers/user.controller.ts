import { Request, Response } from "express"
import { encrypt } from "../helpers/helpers"
import { User } from "../schemas/User"

export class UserController {
  //create user
  static async create(req: Request, res: Response) {
    const email = req.body.email
    //verify phone number to be numbers only
    const phone = req.body.phone
    if (!/^\d+$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" })
    }

    if (await User.findOneBy({ email: email })) {
      return res.status(400).json({ message: "User already exists" })
    }
    const { firstName, lastName, password } = req.body
    const encryptedPassword = await encrypt.encryptpass(password)
    const user = new User()
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.phone = phone
    user.password = encryptedPassword
    user.role = "Employee"
    user.leaveBalance = 20

    await User.save(user)

    const { password: _, createdAt, updatedAt, ...result } = user
    return res
      .status(200)
      .json({ message: "User created successfully", user: result })
  }

  static async addUser(req: Request, res: Response) {
    const email = req.body.email
    //verify phone number to be numbers only
    const phone = req.body.phone
    if (!/^\d+$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" })
    }

    if (await User.findOneBy({ email: email })) {
      return res.status(400).json({ message: "User already exists" })
    }
    const { firstName, lastName, password } = req.body
    const encryptedPassword = await encrypt.encryptpass(password)
    const user = new User()
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.phone = phone
    user.password = encryptedPassword
    user.role = "Employee"
    user.leaveBalance = 20

    await User.save(user)
    return res.status(200).json({ message: "User created successfully" })
  }

  static async makeHR(req: Request, res: Response) {
    const id = req.params.id
    const user = await User.findOneBy({ id: id })
    if (user) {
      user.role = "HR"
      await User.save(user)
      return res.status(200).json({
        message: "User " + user.firstName + user.lastName + " is now an HR",
      })
    }
    return res.status(404).json("User not found")
  }

  static async makeEmployee(req: Request, res: Response) {
    const id = req.params.id
    const user = await User.findOneBy({ id: id })
    if (user) {
      user.role = "Employee"
      await User.save(user)
      return res.status(200).json({
        message:
          "User " + user.firstName + user.lastName + " is now an employee",
      })
    }
    return res.status(404).json("User not found")
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

  //get user by id
  static async getUserById(req: any, res: Response) {
    const user = await User.findOneBy({
      id: req.authUser.id,
    })
    if (user) {
      const { password, createdAt, updatedAt, ...result } = user
      return res.status(200).json({ data: result })
    }
    return res.status(404).json("User not found")
  }

  //get users with role user
  static async getEmployees(req: Request, res: Response) {
    const users = await User.findBy({ role: "Employee" })
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

  static async getEmployeesCount(req: Request, res: Response) {
    const userCount = await User.countBy({ role: "Employee" })
    return res.status(200).json({ data: userCount })
  }

  static async getHRCount(req: Request, res: Response) {
    const HRCount = await User.countBy({ role: "HR" })
    return res.status(200).json({ data: HRCount })
  }

  static async updateProfile(req: any, res: Response) {
    const id = req.authUser.id
    const user = await User.findOneBy({ id: id })
    if (user) {
      const { email } = req.body
      const existEmail = await User.findOneBy({
        email: email,
      })
      if (existEmail && existEmail.id !== user.id) {
        return res.status(400).json({ message: "Email already exists" })
      }
      const { firstName, lastName, phone } = req.body
      user.firstName = firstName
      user.lastName = lastName
      user.phone = phone
      user.email = email
      await User.save(user)
      res.status(200).json({ message: "User updated successfully" })
    } else {
      res.status(404).json("User not found")
    }
  }

  static async updatePassword(req: any, res: Response) {
    const id = req.authUser.id
    const { oldPassword, newPassword } = req.body
    const user = await User.findOneBy({ id: id })
    if (user) {
      const isPasswordValid = await encrypt.comparepassword(
        user.password,
        oldPassword
      )
      if (isPasswordValid) {
        const encryptedPassword = await encrypt.encryptpass(newPassword)
        user.password = encryptedPassword
        await User.save(user)
        return res
          .status(200)
          .json({ message: "Password updated successfully" })
      }
      return res.status(400).json({ message: "Invalid password" })
    }
    return res.status(404).json("User not found")
  }

  static async deleteUser(req: Request, res: Response) {
    const id = req.params.id
    const user = await User.findOneBy({
      id: id,
    })
    if (user) {
      await User.remove(user)
      res.status(200).json({ message: "ok" })
    }
  }

  //get leave balance
  static async getMyLeaveBalance(req: any, res: Response) {
    const id = req.authUser.id
    const user = await User.findOneBy({
      id: id,
    })
    if (user) {
      return res.status(200).json({ leaveBalance: user.leaveBalance })
    }
  }

  static async updateLeaveBalance(user: User, newBalance: number) {
    user.leaveBalance = newBalance
    await User.save(user)
  }
}
