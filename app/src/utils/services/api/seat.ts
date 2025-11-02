import api from "@utils/services/api";

async function getSeats() {
  return (await api.get(`/api/seats`)).data as any;
}

export const SeatService = {
  list: getSeats
};
