import api from "@utils/services/api";

async function getCategories() {
  return (await api.get(`/api/category`)).data as any;
}

async function syncCategories() {
  return (await api.get(`/api/category/sync`)).data as any;
}

export const CategoryService = {
  list: getCategories,
  sync: syncCategories
};
