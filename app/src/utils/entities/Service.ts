import { FactorIA, Line } from ".";
import { ExternalPrice } from "./externa/ExternalPrice";


export interface Seats {
  [x: string]: any;
  id: number;
  status: string;
  type: string;
  weight: number;
  floor: number;
  price: number;
  subArray: number;
}

export interface Price {
  [x: string]: any;
  seatsEnd?: Seats[][];
  factors: FactorIA[];
  seats?: Seats[][];
}

export interface Sections {
  order?: string;
  code: string;
  description: string;
  antt_code?: string;
  arrival_time?: string;
}


export type Service = {
  precision: any;
  factors: any;
  description: string;
  id: string;
  service_code: string;
  service_departure_time: string;
  service_departure_date?: string;
  service_direction: string;
  service_type: string;
  service_status: string;
  service_seats: string;
  line: Line;
  frequency: object[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  check?: boolean;
  sections?: Sections[];
  class?: string[];
  priceEnd?: Price[];
  price: ExternalPrice;
}

