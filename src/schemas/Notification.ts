import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
} from "typeorm"
import { User } from "./User"

@Entity({ name: "notifications" })
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User, user => user.notifications, { nullable: false })
  user: User

  @Column({ nullable: false })
  title: string

  @Column({ nullable: false })
  message: string

  @Column({ default: false })
  isRead: boolean

  @CreateDateColumn()
  createdAt: Date
}
