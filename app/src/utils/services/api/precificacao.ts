import { Line } from "@utils/entities/Line";
import { Origin, Destination } from "@utils/entities/RoutePoint";
import api from "@utils/services/api";

type PrecisionRequest = {
  line: Line,
  dateForecast: string,
  timePurchase: number,
  daysAdvance: number,
  origin: string,
  destination: string,
  tariff_value: number,
  route_km: number
}

async function postPrecision(payload: PrecisionRequest) {
  return (await api.post(`/api/pricing/precision`, payload)).data as any;
}

export const PricingService = {
  precision: postPrecision
};
