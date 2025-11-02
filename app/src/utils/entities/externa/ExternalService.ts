export interface ExternalService {
  record_number?: number;
  travel_id: string;
  company_code: string;
  company_name: string;
  service_code: string;
  service_departure_date: string;
  service_departure_time: string;
  service_direction: string;
  service_type: string;
  service_status: string;
  service_seats: string;
  line_id: number;
  line_code: string;
  line_description: string;
  class: [
      {
          class_code: string;
          class_prefix: string;
      }
  ];
  sections?: [
      {
          order: string;
          code: string;
          description: string;
          antt_code: string;
          arrival_time: string;
      }
  ];
  frequency: [
      {
          sunday: boolean;
          monday: boolean;
          tuesday: boolean;
          wednesday: boolean;
          thursday: boolean;
          friday: boolean;
          saturday: boolean;
          holiday: string;
      }
  ]
}
