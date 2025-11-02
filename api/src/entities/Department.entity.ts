import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterUpdate,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Department {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  managerId: string | null;

  @ManyToOne(() => User, (manager) => manager.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "managerId" })
  manager: User;


  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @AfterUpdate()
  protected setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
