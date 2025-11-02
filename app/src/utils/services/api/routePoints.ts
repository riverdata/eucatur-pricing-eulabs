import api from "@utils/services/api";

async function getRoutePointsByOriginAndLine(lineCode: string, originCode: string) {
  return (await api.get(`/api/routePoints/line/${lineCode}/origin/${originCode}`)).data as any;
}

async function getRoutePointsByLine(lineCode: string) {
  return (await api.get(`/api/routePoints/line/${lineCode}`)).data as any;
}

export const RoutePointsService = {
  listByOriginAndLine: getRoutePointsByOriginAndLine,
  listByLine: getRoutePointsByLine
};
