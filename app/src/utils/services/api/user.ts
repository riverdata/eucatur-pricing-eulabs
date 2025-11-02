import { Department, User, UserRole } from "@utils/entities";
import api from "@utils/services/api";

type CreateUserInput = {
  name: string;
  email: string;
  surname: string;
  role?: UserRole;
  department?: Department;
};

type UpdateUserInput = {
  id: string;
  name: string;
  email: string;
  surname: string;
  role: UserRole;
  department: Department;
};


async function listUser(): Promise<User[]> {

  const { data } = (await api.get("/api/users")).data;
  return data
}

async function createUser(payload: CreateUserInput) {
  return (await api.post("/api/users", payload)).data.data;
}

async function updateUser(payload: UpdateUserInput) {
  return (await api.patch(`/api/users/${payload.id}`, payload)).data.data;
}

async function deleteUser(userId: string) {
  return (await api.delete(`/api/users/${userId}`)).data;
}

async function createOrUpdateUser(payload: any): Promise<User> {
  if (payload.id) {
    return updateUser(payload)
  }

  return createUser(payload)
}

async function getUser(userId: string): Promise<User> {
  const response = (await api.get(`/api/users/${userId}`)).data
  return response.data
}

async function resendEmailActivationToUser(userId: string) {
  return (await api.post(`/api/users/${userId}/email-confirmation`)).data;
}

export const UserService = {
  getOne: getUser,
  getAll: listUser,
  delete: deleteUser,
  createOrUpdate: createOrUpdateUser,
  resendEmailActivation: resendEmailActivationToUser
};
