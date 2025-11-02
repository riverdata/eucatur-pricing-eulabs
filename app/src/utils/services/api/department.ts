import { Department, User } from "@utils/entities";
import api from "@utils/services/api"
type CreateInput = {
  id?: string;
  description: string;
  manager?: User;
};

async function listDepartment() {
  return (await api.get(`/api/department`)).data as any;
}

async function getDepartment(departmentId: string): Promise<Department> {
  const response = (await api.get(`/api/department/${departmentId}`)).data
  return response.data
}


async function createDepartment(payload: CreateInput) {
  return (await api.post(`/api/department`, payload)).data.data;
}

async function updateDepartment(payload: CreateInput) {
  return (await api.patch(`/api/department/${payload.id}`, payload)).data.data;
}

async function deleteDepartment(id: string) {
  return (await api.delete(`/api/department/${id}`)).data;
}

async function createOrUpdateDepartment(payload: any): Promise<Department> {
  if (payload.id) {
    return updateDepartment(payload)
  }

  return createDepartment(payload)
}

export const DepartmentService = {
  getOne: getDepartment,
  list: listDepartment,
  create: createDepartment,
  update: updateDepartment,
  createOrUpdate: createOrUpdateDepartment,
  delete: deleteDepartment
};