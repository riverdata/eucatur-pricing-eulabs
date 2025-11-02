import api from "@utils/services/api";


async function createDashboard(payload: any) {
  return (await api.post("/api/dashboard", payload)).data as any;
}

async function updateDashboard(id: string, payload: any) {
  return (await api.patch(`/api/dashboard/${id}`, payload)).data as any;
}

async function getDashboards() {
  return (await api.get("/api/dashboard")).data as any;
}

async function getDashboard(id: string) {
  return (await api.get(`/api/dashboard/${id}`)).data as any;
}

async function deleteDashboard(id: string) {
  return (await api.delete(`/api/dashboard/${id}`)).data as any;
}

async function importFile(id: string, body: any) {
  return (await api.post(`/api/dashboard/${id}/file`, body)).data as any;
}

async function appendFile(id: string, columnName: string, isUpdate: boolean, body: any) {
  return (await api.post(`/api/dashboard/${id}/file/${columnName}/${isUpdate}`, body))
    .data as any;
}

export const DashService = {
  create: createDashboard,
  createOrUpdate: updateDashboard,
  getAll: getDashboards,
  getId: getDashboard,
  deleteId: deleteDashboard,
  import: importFile,
  append: appendFile
};
