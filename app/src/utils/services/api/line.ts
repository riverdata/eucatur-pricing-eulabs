import api from "@utils/services/api";

async function getLines() {
  return (await api.get(`/api/lines`)).data as any;
}

async function syncLines() {
  return (await api.get(`/api/lines/sync`)).data as any;
}

export const LineService = {
  list: getLines,
  sync: syncLines
};
