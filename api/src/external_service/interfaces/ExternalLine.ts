interface ExternalLine {
  record_number: number;
  line_id: number;
  line_code: string;
  line_description: string;
  company_code: string;
  company_name: string;
  granting_authority_code: string;
  granting_authority_description: string;
  line_status: string;
  line_total_km: string;
  class: [
    {
      class_code: string;
      class_prefix: string;
    }
  ];
}

export {
  ExternalLine
}