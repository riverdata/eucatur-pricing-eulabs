interface ExternalItinerary {
  record_number: number;
  order: number;
  origin_sectional_code: string;
  origin_sectional_description: string;
  destiny_sectional_code: string;
  destiny_sectional_description: string;
  route_km: number;
}

export {
  ExternalItinerary
}