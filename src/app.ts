import express from "express"
import "reflect-metadata"
import authRoute from "./routes/auth.route"
import { AppDataSource } from "./config/data-source"
import "dotenv/config"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/auth", authRoute)

app.listen(port, () => {
  AppDataSource.initialize()
    .then(async () => {
      console.log(`Example app listening on port ${port}`)
    })
    .catch(error => console.log(error))
})
