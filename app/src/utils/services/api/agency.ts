import api from "@utils/services/api";

async function getAgency() {
  return (await api.get(`/api/agency`)).data as any;
}

async function getAgencyActive() {
  return (await api.get(`/api/agency/active`)).data as any;
}

async function syncAgency() {
  return (await api.get(`/api/agency/sync`)).data as any;
}

export const AgencyService = {
  list: getAgency,
  listActive: getAgencyActive,
  sync: syncAgency
};
