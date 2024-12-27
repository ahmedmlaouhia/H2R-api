import express from "express"
import "reflect-metadata"
import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes"
import { AppDataSource } from "./config/data-source"
import "dotenv/config"
import cors from "cors"
import { errorHandler } from "./middleware/error.middleware"
import leaveRouter from "./routes/leave.routes"
import timesheetRouter from "./routes/timesheet.routes"
import { Server } from "socket.io"
import { createServer } from "http"
import { LeaveController } from "./controllers/leave.controller"
import notificationRouter from "./routes/notification.routes"

let connectedUsers = new Map<string, string>()

const app = express()
const port = process.env.PORT || 3000
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
})

app.use(errorHandler)

io.on("connection", socket => {
  socket.on("join", (userId: any) => {
    connectedUsers.set(userId, socket.id)
    console.log(connectedUsers)
    io.to(socket.id).emit("connected")
  })

  socket.on("leaveApproved", (leaveId: string) => {
    LeaveController.getUserId(leaveId).then(userId => {
      userId && io.to(String(connectedUsers.get(userId))).emit("leaveApproved")
    })
  })

  socket.on("leaveRejected", (leaveId: string) => {
    LeaveController.getUserId(leaveId).then(userId => {
      userId && io.to(String(connectedUsers.get(userId))).emit("leaveRejected")
    })
  })

  socket.on("timesheetApproved", (timesheetId: string) => {
    LeaveController.getUserId(timesheetId).then(userId => {
      userId &&
        io.to(String(connectedUsers.get(userId))).emit("timesheetApproved")
    })
  })

  socket.on("disconnect", () => {
    connectedUsers.forEach((value, key) => {
      if (value === socket.id) {
        connectedUsers.delete(key)
      }
    })
  })
})

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/leave", leaveRouter)
app.use("/timesheets", timesheetRouter)
app.use("/notifications", notificationRouter)

app.use(errorHandler)

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!")
    httpServer.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  .catch(error => console.log(error))
