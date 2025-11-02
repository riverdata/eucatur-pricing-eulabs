import { AgencyType } from "./AgencyType";

export interface Agency {
  id: string;
  description: string;
  agency_id: number;
  agency_code: string;
  agency_description: string;
  agency_boarding_disembarking: string;
  agency_type: AgencyType;
  agency_typeId: string;
  agency_status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}