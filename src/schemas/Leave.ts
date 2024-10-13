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
  id: string

  @ManyToOne(() => User, user => user.leaves)
  user: User

  @Column({ nullable: false })
  startDate: Date

  @Column({ nullable: false })
  endDate: Date

  @Column({ nullable: false, default: "Pending" })
  status: string // Pending, Approved, Rejected, Canceled

  @Column({ nullable: false })
  reason: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
