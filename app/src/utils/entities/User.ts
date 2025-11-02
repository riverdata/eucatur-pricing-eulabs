import { Department } from "./Department";

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

export type User = {
    departmentId: string;
    id: string;
    name: string;
    surname: string;
    email: string;
    password?: string;
    department?: Department;
    activationToken?: string;
    resetPasswordToken?: string;
    role: UserRole;
    status: UserStatus;
    statusText?: string | undefined;
    userRoleText?: string | undefined;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export const UserRoleDescriptions = {
    [UserRole.MASTERADMIN]: "Administrador Principal",
    [UserRole.ADMINMANAGER]: "Gerente de Administração",
    [UserRole.USER]: "Usuário Comum",
  };
