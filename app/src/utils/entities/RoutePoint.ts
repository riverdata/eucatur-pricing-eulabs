import { Line } from ".";

export type BusStop = {
  description: string;
  sectional_code: string;
  sectional_description: string;
}

export type RoutePoints = {
  description: string;
  route_km: number;
  line?: Line;
  origin?: BusStop;
  destination?: BusStop;
}

export type Origin = Pick<RoutePoints, "line">& {
  description: string;
  line?: Line;
  sectional_code: string;
  sectional_description: string;
};

export type Destination = {
  description: string;
  routeRoint: RoutePoints
};