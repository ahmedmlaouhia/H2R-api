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

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

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

  @Column({ default: "user" }) //user, HR, admin
  role: string

  @Column({ nullable: false, default: 20 })
  leaveBalance: number

  @OneToMany(() => Leave, leave => leave.user)
  leaves: Leave[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
