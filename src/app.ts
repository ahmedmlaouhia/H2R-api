import express from "express"
import "reflect-metadata"
import userRouter from "./routes/user.route"
import { AppDataSource } from "./config/data-source"
import "dotenv/config"
import cors from "cors"
import { errorHandler } from "./middleware/error.middleware"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use("/user", userRouter)
app.use(errorHandler)

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!")
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  .catch(error => console.log(error))
