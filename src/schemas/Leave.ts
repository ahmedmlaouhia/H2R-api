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

@Entity({ name: "leaves" })
export class Leave extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @ManyToOne(() => User, user => user.leaves)
  user: User

  @Column({ nullable: false })
  startDate: Date

  @Column({ nullable: false })
  endDate: Date

  @Column({ nullable: false, default: "pending" })
  status: string // pending, approved, rejected

  @Column({ nullable: false })
  reason: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
