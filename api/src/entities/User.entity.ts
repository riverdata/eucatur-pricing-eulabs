import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  DeleteDateColumn,
  AfterUpdate,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Department } from "./Department.entity";

export enum UserRole {
  MASTERADMIN = "MasterAdmin",
  ADMINMANAGER = "AdminManager",
  USER = "User"
}

export enum UserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  INACTIVE = "inactive",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  departmentId: string | null;

  @ManyToOne(() => Department, (department) => department.id, { onDelete: "SET NULL" })
  @JoinColumn({ name: "departmentId" })
  department: Department;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  activationToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  statusText: string | undefined;

  userRoleText: string | undefined;

  @AfterLoad()
  setComputed() {
    switch (this.status) {
      case UserStatus.ACTIVE: {
        this.statusText = "Ativo";
        break;
      }
      case UserStatus.INACTIVE: {
        this.statusText = "Inativo";
        break;
      }
      case UserStatus.PENDING: {
        this.statusText = "Pendente";
        break;
      }
      default: {
        this.statusText = undefined;
        break;
      }
    }

    switch (this.role) {
      case UserRole.MASTERADMIN: {
        this.userRoleText = "Administrador Principal";
        break;
      }
      case UserRole.ADMINMANAGER: {
        this.userRoleText = "Gerente de Administração";
        break;
      }
      case UserRole.USER: {
        this.userRoleText = "Usuário Comum";
        break;
      }
      default: {
        this.userRoleText = undefined;
        break;
      }
    }
  }

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
