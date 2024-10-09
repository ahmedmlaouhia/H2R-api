import express from "express"
import "reflect-metadata"
import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes"
import { AppDataSource } from "./config/data-source"
import "dotenv/config"
import cors from "cors"
import { errorHandler } from "./middleware/error.middleware"
import leaveRouter from "./routes/leave.routes"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/leave", leaveRouter)

app.use(errorHandler)

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!")
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  .catch(error => console.log(error))
