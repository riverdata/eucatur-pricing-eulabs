import api from "@utils/services/api"


type CreateInput = {
  lineCode: string;
  operationDate: string;
  class_code: string[];
  secctional_origin_code?: string;
  secctional_destiny_code?: string;
};

async function getServicesByLineCode(lineCode: string) {
  return (await api.get(`/api/externalService/services/${lineCode}`)).data as any;
}

async function getServicesByPrice(payload: CreateInput) {
  return (await api.post(`/api/externalService/price`, payload)).data as any;
}


export const ExternalServices = {
  servicesByLineCode: getServicesByLineCode,
  servicesByPrice: getServicesByPrice
};
