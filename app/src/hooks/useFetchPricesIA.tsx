import { Category, Price, RoutePoints, Seats, Service } from "@utils/entities";
import { ExternalServices } from "@utils/services/api/Externalservices";
import { ExternalPrice } from "@utils/entities/externa/ExternalPrice";

const calculationPriceIA = (seat: Seats, priceEnd: any, service: Service) => {

  let weightAdd: number = seat.weight;
  let seats = {
    poltrona: seat.id,
    value: 0
  }

  if (weightAdd === 0 && priceEnd.factors[1].factor_weight_add) {
    const factorEspacoInterno = priceEnd.factors[1].factor_weight_add
    if (factorEspacoInterno.length > 0) {
      const subfactoR = factorEspacoInterno.filter((item: any) => item.type.trim().toUpperCase() === seat.type.trim().toUpperCase())
      if (subfactoR.length > 0) {
        seats.value = Number(subfactoR[0].value)
      } else {
        if (seat.type.trim().toUpperCase() === "NORMAL") {
          const subfactoR = factorEspacoInterno.filter((item: any) => service.price.class_description.trim().toUpperCase().includes(item.type.trim().toUpperCase()))
          if (subfactoR.length > 0) {
            seats.value = Number(subfactoR[0].value)
          }
        }
      }
    }
  } else {
    seats.value = Number(service.price.amount + (service.price.amount * weightAdd / 100))
  }

  return [seats.value.toFixed(2), seats];

};

export const useFetchPrices = () => {

  const fetchPricesIA = async (services: Service[], categories: Category[], itineraries: RoutePoints[]): Promise<Service[]> => {
    try {

      let dataSeats: Service[] = []

      for (let index = 0; index < services.length; index++) {
        const service = services[index];
        const response = await ExternalServices.servicesByPrice({
          lineCode: service.line.line_code,
          class_code: service.class,
          operationDate: service.service_departure_date,
          secctional_origin_code: "",
          secctional_destiny_code: ""
        });

        let dataSeatsLine = response.data;

        if (itineraries.length > 0) {
          const filteredDataSeats: Service[] = dataSeatsLine.filter(serv => {
            const isInItineraries = itineraries.some(itinerary => itinerary.line.line_code === service.line.line_code && itinerary.origin.sectional_code === serv.secctional_origin_code && itinerary.destination.sectional_code === serv.secctional_destiny_code);

            return isInItineraries;
          });
          dataSeatsLine = filteredDataSeats
        }

        const dataSeatsLineResult = dataSeatsLine.map((item: ExternalPrice) => {
          const alreadyFormatted = typeof service.id === "string" && service.id.includes(" - ") && service.id.includes(" X ");
          const nameService = alreadyFormatted ? service.id : `${service.id.trim()} - ${item.secctional_origin_code.trim()} X ${item.secctional_destiny_code.trim()}`;
          return {
            ...service,
            id: nameService,
            price: {
              class_code: item.class_code,
              class_description: categories.find(cat => cat.class_code === item.class_code)?.description || "",
              description: `${item.secctional_origin_code} - ${item.secctional_origin_description} X ${item.secctional_destiny_code} - ${item.secctional_destiny_description}`,
              secctional_origin_code: item.secctional_origin_code,
              secctional_origin_description: item.secctional_origin_description,
              secctional_destiny_code: item.secctional_destiny_code,
              secctional_destiny_description: item.secctional_destiny_description,
              route_km: item.route_km,
              tariff_value: item.tariff_value,
              boarding_fee_value: item.boarding_fee_value,
              insurance_value: item.insurance_value,
              toll_value: item.toll_value,
              other_value: item.other_value,
              amount: item.amount
            }
          }
        })

        dataSeats = [...dataSeats, ...dataSeatsLineResult]

      }
      return dataSeats;
    } catch (error) {
      return []
    }

  };

  const fetchPricesSeatsIA = async (services: Service[]): Promise<Service[]> => {
    try {

      let dataSeats: Service[] = []
      for (let index = 0; index < services.length; index++) {
        const service = services[index];
        
        const dataSeatsLineResult = service.priceEnd.map((item: any) => {
          let consoleWeight = []
          const result = {
            ...item,
            seatsEnd: item.seats?.map((seatRow: any[]) => {
              return seatRow.map((seats: any[]) => {
                return seats.map((seat: Seats) => {
                  const calculation = calculationPriceIA(seat, item, service)
                  consoleWeight.push(calculation[1])
                  return {
                    ...seat,
                    price: calculation[0]
                  }
                })
              });
            })
          }

          return result
        })

        dataSeats = [...dataSeats, { ...service, priceEnd: dataSeatsLineResult }]

      }

      return dataSeats;
    } catch (error) {
      return []
    }

  };

  return { fetchPricesIA, fetchPricesSeatsIA };
};
