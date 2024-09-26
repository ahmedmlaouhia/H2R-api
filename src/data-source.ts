import { DataSource } from "typeorm"
import { User } from "./schemas/User"
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "h2r@123456",
  database: "h2r",
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
})
