import { useFormContext } from "react-hook-form";
import { ExternalService, Line, Service } from "@utils/entities";
import { ExternalServices } from "@utils/services/api/Externalservices";

export const useFetchServices = () => {

  const fetchServices = async (lines: Line[]): Promise<{
    serviceTravel: Service[];
    serviceAll: Service[];
    serviceSimulador: Service[];
  }> => {
    try {
      let serviceTravel: Service[] = []
      let serviceAll: Service[] = []
      let serviceSimulador: Service[] = []
      if (lines.length > 0) {
        for (let index = 0; index < lines.length; index++) {
          const line = lines[index];
          const response = await ExternalServices.servicesByLineCode(line.line_code);
          const data = response.data.map((item: ExternalService) => {
            return {
              id: item.travel_id,
              travel_id: item.travel_id,
              description: `${item.service_departure_date} - ${item.service_departure_time} (${item.service_direction})`,
              service_code: item.service_code,
              service_departure_date: item.service_departure_date,
              service_departure_time: item.service_departure_time,
              service_direction: item.service_direction,
              service_type: item.service_type,
              service_status: item.service_status,
              service_seats: item.service_seats,
              class: item.class,
              sections: item.sections,
              frequency: item.frequency,
              line: line
            }
          })
          serviceSimulador = [...serviceSimulador, ...data]
          serviceTravel = [...serviceTravel, ...serviceSimulador.filter((item: Service) => line.direction.description != "Ambos" ? item.service_direction.trim().toUpperCase() === line.direction.description.trim().toUpperCase() : true)]
        }
        serviceAll = serviceTravel.filter((obj: Service, index: any, self: Service[]) =>
          index === self.findIndex((o) => o.service_code === obj.service_code && o.service_direction === obj.service_direction && o.service_departure_time === obj.service_departure_time)
        ).map((item: Service) => { return { ...item, service_departure_date: "" } })

      }
      return {
        serviceTravel,
        serviceAll,
        serviceSimulador,
      }
    } catch (error) {
      throw new Error("Erro modificado: " + error.message);
    }
  };

  return { fetchServices };
};
