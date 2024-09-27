import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ default: "user" })
  role: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
