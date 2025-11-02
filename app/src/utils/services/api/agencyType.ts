import api from "@utils/services/api";

async function getAgencyType() {
  return (await api.get(`/api/agencyType`)).data as any;
}


export const AgencyTypeService = {
  list: getAgencyType,
};
