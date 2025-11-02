export interface ExternalPrice {
  line_id: number;
  line_code: string;
  description?: string;
  company_code: string;
  tariff_effective_date: string;
  class_code: string;
  class_description?: string;
  class_prefix: string;
  secctional_origin_code: string;
  secctional_origin_description: string;
  secctional_destiny_code: string;
  secctional_destiny_description: string;
  route_km: number;
  tariff_value: number;
  boarding_fee_value: number;
  insurance_value: number;
  toll_value: number;
  other_value: number;
  amount: number
}
