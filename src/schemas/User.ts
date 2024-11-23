import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm"
import { Leave } from "./Leave"
import { Timesheet } from "./Timesheet"

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  lastName: string

  @Column({ nullable: false })
  phone: string

  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ default: "Employee" }) //Employee, HR, Admin
  role: string

  @Column({ nullable: false, default: 20 })
  leaveBalance: number

  @OneToMany(() => Leave, leave => leave.user)
  leaves: Leave[]

  @OneToMany(() => Timesheet, timesheet => timesheet.user)
  timesheets: Timesheet[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
