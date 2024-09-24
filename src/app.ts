import express from "express"
import "reflect-metadata"
import authRoute from "./routes/auth.route"
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/auth", authRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
