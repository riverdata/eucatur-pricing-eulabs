import { User } from ".";

export interface Department {
  id: string;
  description: string;
  manager: User;
  managerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}