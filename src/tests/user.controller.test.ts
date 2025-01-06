import { Request, Response } from "express"
import { UserController } from "../controllers/user.controller"
import { User } from "../schemas/User"
import { encrypt } from "../helpers/helpers"

jest.mock("../schemas/User")
jest.mock("../helpers/helpers")

describe("UserController", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let jsonMock: jest.Mock
  let statusMock: jest.Mock

  beforeEach(() => {
    jsonMock = jest.fn()
    statusMock = jest.fn(() => ({ json: jsonMock }))
    mockRequest = {}
    mockResponse = {
      status: statusMock,
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("create", () => {
    it("should create a new user successfully", async () => {
      mockRequest.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "password123",
      }

      ;(User.findOneBy as jest.Mock).mockResolvedValue(null)
      ;(encrypt.encryptpass as jest.Mock).mockResolvedValue(
        "encrypted_password"
      )
      ;(User.save as jest.Mock).mockResolvedValue({
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        role: "Employee",
        leaveBalance: 20,
      })

      await UserController.create(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(User.findOneBy).toHaveBeenCalledWith({ email: "john@example.com" })
      expect(encrypt.encryptpass).toHaveBeenCalledWith("password123")
      expect(User.save).toHaveBeenCalled()
      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        message: "User created successfully",
        user: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "1234567890",
          role: "Employee",
          leaveBalance: 20,
        },
      })
    })

    it("should return 400 if email already exists", async () => {
      mockRequest.body = { email: "john@example.com" }

      ;(User.findOneBy as jest.Mock).mockResolvedValue({
        id: "1",
        email: "john@example.com",
      })

      await UserController.create(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(User.findOneBy).toHaveBeenCalledWith({ email: "john@example.com" })
      expect(statusMock).toHaveBeenCalledWith(400)
      expect(jsonMock).toHaveBeenCalledWith({ message: "User already exists" })
    })

    it("should return 400 if phone number is invalid", async () => {
      mockRequest.body = {
        phone: "invalid_phone",
      }

      await UserController.create(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid phone number" })
    })
  })

  describe("getAll", () => {
    it("should return all users without sensitive fields", async () => {
      ;(User.find as jest.Mock).mockResolvedValue([
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "1234567890",
          password: "encrypted_password",
          role: "Employee",
          leaveBalance: 20,
        },
      ])

      await UserController.getAll(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(User.find).toHaveBeenCalled()
      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        data: [
          {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "1234567890",
            role: "Employee",
            leaveBalance: 20,
          },
        ],
      })
    })
  })

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      mockRequest.authUser = { id: "1" }

      ;(User.findOneBy as jest.Mock).mockResolvedValue({
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "encrypted_password",
        role: "Employee",
        leaveBalance: 20,
      })

      await UserController.getUserById(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(User.findOneBy).toHaveBeenCalledWith({ id: "1" })
      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        data: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "1234567890",
          role: "Employee",
          leaveBalance: 20,
        },
      })
    })

    it("should return 404 if user not found", async () => {
      mockRequest.authUser = { id: "1" }

      ;(User.findOneBy as jest.Mock).mockResolvedValue(null)

      await UserController.getUserById(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(User.findOneBy).toHaveBeenCalledWith({ id: "1" })
      expect(statusMock).toHaveBeenCalledWith(404)
      expect(jsonMock).toHaveBeenCalledWith("User not found")
    })
  })
})
