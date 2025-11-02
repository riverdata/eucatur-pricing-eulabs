export interface ExternalAgency {
  record_number: number;
  agency_id: number;
  agency_code: string;
  agency_description: string;
  locality: {
      city_name: string;
      city_code_ibge: string;
      state_abbreviation: string;
  },
  agency_boarding_disembarking: string;
  agency_type: string;
  agency_status: string;
}
