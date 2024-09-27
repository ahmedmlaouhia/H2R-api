import express from "express"
import "reflect-metadata"
import userRouter from "./routes/user.route"
import { AppDataSource } from "./config/data-source"
import "dotenv/config"
import { errorHandler } from "./middleware/error.middleware"
import { Request, Response } from "express"

const app = express()
const port = process.env.PORT || 3000
app.use(errorHandler)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/user", userRouter)

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Not Found" })
})

app.listen(port, () => {
  AppDataSource.initialize()
    .then(async () => {
      console.log(`Example app listening on port ${port}`)
      console.log("Data Source has been initialized!")
    })
    .catch(error => console.log(error))
})
