import { Factor, IFactorAdd } from "@utils/entities";
import api from "@utils/services/api"
type CreateInput = {
  description: string;
  factor_code: string;
  factor_description: string;
  factor_weight: number;
  factor_weight_add: IFactorAdd[];
};

async function getFactor() {
  return (await api.get(`/api/factor`)).data as any;
}

async function createFactor(payload: CreateInput) {
  return (await api.post(`/api/factor`, payload)).data as any;
}

async function updateFactor(payload: Factor) {
  return (await api.patch(`/api/factor/${payload.id}`, payload)).data as any;
}

async function deleteFactor(id: string) {
  return (await api.delete(`/api/factor/${id}`)).data;
}

export const FactorService = {
  list: getFactor,
  create: createFactor,
  update: updateFactor,
  delete: deleteFactor
};