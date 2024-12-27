import { DataSource } from "typeorm"
import { User } from "../schemas/User"
import "dotenv/config"
import { Leave } from "../schemas/Leave"
import { Timesheet } from "../schemas/Timesheet"
import { Notification } from "../schemas/Notification"

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Leave, Timesheet, Notification],
  subscribers: [],
  migrations: [],
})
