import { RoutePoints } from ".";
import { Line } from "./Line";

export enum PricingStatus {
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
  SCHEDULED = 'scheduled',
}

export type PricingHistory = {
  pricing_code: string;
  id?: string;
  description: string;
  lineId: string;
  line: Line;
  origin: string;
  destiny: string;
  timePurchase: [{ value: string, description: string, start: number, end: number }];
  daysAdvance?: string;
  itineraries: RoutePoints[];
  forecastDate: object[];
  factors: object[];
  purchaseDates: object[];
  optionalDetails?: object;
  servicesEnd: object[];
  purchaseDatesFormat?: string[];
  forecastDateFormat?: string[];
  status: PricingStatus;
  statusText?: string | undefined;
  activationDate: Date;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}