import { Line, PricingHistory, PricingStatus } from "@utils/entities";
import api from "@utils/services/api"
type CreateInput = {
  id?: string;
  description?: string;
  lineId?: string;
  line?: Line;
  origin?: string;
  destiny?: string;
  timePurchase?: object[];
  itineraries?: object[];
  forecastDate?: object[];
  factors?: object[];
  purchaseDates?: object[];
  optionalDetails?: object;
  servicesEnd?: object[];
  status?: PricingStatus;
  activationDate?: Date;
  expiresAt?: Date;
};

async function getPricingHistory() {
  return (await api.get(`/api/pricing_history`)).data as any;
}

async function getPricingHistoryOne(id: string): Promise<PricingHistory> {
  const response = (await api.get(`/api/pricing_history/${id}`)).data
  return response.data
}

async function createPricingHistory(payload: CreateInput) {
  return (await api.post(`/api/pricing_history`, payload)).data as any;
}

async function updatePricingHistory(payload: CreateInput) {
  const { id, ...updateData } = payload;
  return (await api.patch(`/api/pricing_history/${id}`, updateData)).data as any;
}

async function deletePricingHistory(id: string) {
  return (await api.delete(`/api/pricing_history/${id}`)).data;
}

export const PricingHistoryService = {
  list: getPricingHistory,
  getOne: getPricingHistoryOne,
  create: createPricingHistory,
  update: updatePricingHistory,
  delete: deletePricingHistory
};