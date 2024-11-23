import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "./User"

@Entity({ name: "timesheets" })
export class Timesheet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User, user => user.timesheets)
  user: User

  @Column({ type: "date", nullable: false })
  date: Date

  @Column({ type: "float", nullable: false })
  hours: number

  @Column({ nullable: false, default: "Pending" })
  status: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
