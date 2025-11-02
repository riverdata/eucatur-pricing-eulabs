import type { FastifyReply, FastifyRequest } from "fastify";
import PricingHistoryService from "../services/PricingHistoryService";
import { Agency, Line, PricingHistory, PricingStatus } from "../entities";
import dayjs from "dayjs";
import { baseencode } from "../utils/compressed";
import utc from 'dayjs/plugin/utc';


interface Seats {
  id: number;
  status: string;
  type: string;
  weight: number;
  floor: number;
  price: number;
  subArray: number;
}

interface Price {
  seatsEnd: Seats[][];
  seats: any[];
  precision: any;
}

interface Itineraries {
  line: {
    line_code: string;
  };
  origin: {
    sectional_code: string;
  };
  destination: {
    sectional_code: string;
  };
}

interface Service {
  id: string;
  travel_id: string;
  service_code: string;
  service_departure_time: string;
  service_departure_date?: string;
  service_direction: string;
  service_type: string;
  service_status: string;
  service_seats: string;
  line: Line;
  frequency: object[];
  class?: string[];
  seats?: Seats[][];
  priceEnd: Price[];
}

interface PricingRequestBody {
  pricing_code: string;
  sale_at: string;
  travel_id: string;
  line_code: string;
  sectional_code_origin: string;
  sectional_code_destination: string;
}

export default class PricingHistoryController {

  /**
   * Handles routes points lines logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await PricingHistoryService.getAll();
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados.",
        });
      }

      const dataHistory = data.map((pricingHistory: PricingHistory) => {
        return {
          ...pricingHistory,
          servicesEnd: pricingHistory.servicesEndDecoded,
          itineraries: pricingHistory.itinerariesDecoded,
          optionalDetails: pricingHistory.optionalDetailsDecoded
        }
      })
      reply.status(200).send({
        success: true,
        data: dataHistory,
        message: "Dados encontrados com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {

    try {
      let body = request.body as any;
      const { description } = body;

      const data = await PricingHistoryService.getByOne({ description: description })

      if (data) {
        return reply.status(400).send({ success: false, message: 'Já existe um registro com essa informação' })
      }

      const { id } = await PricingHistoryService.create(body)

      reply.status(201).send({ success: true, data: { id, ...body }, message: 'Criado com sucesso.' })

    } catch (error) {
      return reply.status(500).send({
        success: false,
        data: error,
        message: "Erro interno no servidor."
      });
    }
  }

  /**
 * Handles details user logic.
 * @param request FastifyRequest with id user in the query.
 * @param reply FastifyReply for sending responses.
 */
  async details(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { id } = request.params as any;

      const data = await PricingHistoryService.getByOne({ id });
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "A precificação não foi encontrada."
        });
      }

      const dataHistory = {
        ...data,
        servicesEnd: data.servicesEndDecoded,
        itineraries: data.itinerariesDecoded,
        optionalDetails: data.optionalDetailsDecoded
      }
      reply.status(200).send({
        success: true,
        data: dataHistory,
        message: "Precificação encontrada."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

  /**
 * Handles details user logic.
 * @param request FastifyRequest with id user in the query.
 * @param reply FastifyReply for sending responses.
 */
  async detailsPricingImpetus(request: FastifyRequest, reply: FastifyReply) {
    try {

      const body = request.body as PricingRequestBody;

      const data = await PricingHistoryService.getBy({ pricing_code: body.pricing_code });
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "A precificação não foi encontrada."
        });
      }

      if (data.status !== PricingStatus.ACTIVE) {
        return reply.status(404).send({
          success: false,
          message: "Precificação indisponivel."
        });
      }

      const itineraries = data.itinerariesDecoded as Itineraries[];

      const matchedItinerary = itineraries.find(itinerary =>
        itinerary.line.line_code === body.line_code &&
        itinerary.origin.sectional_code === body.sectional_code_origin &&
        itinerary.destination.sectional_code === body.sectional_code_destination
      );

      if (!matchedItinerary) {
        return reply.status(404).send({
          success: false,
          message: `Dados não encontrados para a linha ${body.line_code} e itinerário ${body.sectional_code_origin} X ${body.sectional_code_destination}`
        });
      }

      const saleDate = new Date(body.sale_at).toISOString().split('T')[0];
      if (!data.purchaseDatesFormat.includes(saleDate)) {
        return reply.status(404).send({
          success: false,
          message: `A data de compra ${body.sale_at} informada não é permitida.`
        });
      }

      const services = data.servicesEndDecoded as Service[];

      const selectedServices = services.find(service => service.travel_id === body.travel_id.trim());
      if (!selectedServices) {
        return reply.status(404).send({
          success: false,
          message: `Servico ${body.travel_id} não foi previsto!`
        });
      }

      dayjs.extend(utc);
      const date = dayjs.utc(body.sale_at).format('YYYY-MM-DD');
      const time = dayjs.utc(body.sale_at).hour();

      const daysInAdvance = dayjs(selectedServices.service_departure_date).diff(dayjs(date), 'day');

      const travel = selectedServices.priceEnd.find(price => price.precision && price.precision.hora_compra == time && price.precision.dias_antecedencia == daysInAdvance);
      if (!travel) {
        return reply.status(404).send({
          success: false,
          message: `Não foi possível localizar uma precificação com a data de compra informada: ${body.sale_at}.`
        });
      }

      const fixedPrice = Array.from(
        new Map(
          travel.seatsEnd
            .flat(3)
            .filter(seat => seat.weight === 0)
            .map(seat => [`${seat.type}-${seat.price}`, {
              seatType: seat.type,
              price: seat.price
            }])
        ).values()
      );
            
      const adjustedPrice = travel.seatsEnd.flat(3).filter(seat => seat.weight != 0)
      

      let agencies: { agency_id: string; agency_description: any; agency_code: any; agency_status: any; agency_type: any; agency_type_code: any; }[] = []
      if(data.optionalDetailsDecoded.agencies){
        agencies = data.optionalDetailsDecoded.agencies.map((agency: any)=> {
          return {
            agency_id: String(agency.agency_id).replace('-', ''),
            agency_description: agency.agency_description,
            agency_code: String(agency.agency_code),
            agency_status: agency.agency_status,
            agency_type: agency.agency_type.description,
            agency_type_code: agency.agency_type.agency_code
          }
        })
      }

      const dataPricing = {
        agencies: agencies,
        fixedPrice: fixedPrice,
        adjustedPrice: adjustedPrice.map(pricing => {
          return {
            seat: pricing.id,
            seatType: pricing.type,
            price: pricing.price,
          }
        })
      }

      reply.status(200).send({
        success: true,
        data: dataPricing,
        message: "Precificação encontrada."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

  /**
   * Handles active account logic.
   * @param request FastifyRequest with token and password in the body.
   * @param reply FastifyReply for sending responses.
   */
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { id } = request.params as any;
      let body = request.body as any;

      const data = await PricingHistoryService.getByOne({ id });

      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "O usuário não foi encontrado."
        });
      }
      
      if (body.itineraries) {
        body.itineraries = baseencode(body.itineraries);
      }
      if (body.servicesEnd) {
        body.servicesEnd = baseencode(body.servicesEnd);
      }
      if (body.optionalDetails) {
        body.optionalDetails = baseencode(body.optionalDetails);
      }
      
      
      await PricingHistoryService.update(id, { ...body });

      reply.status(200).send({
        success: true,
        message: "Atualizado com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
        data: error,
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

  /**
 * Handles delete user logic.
 * @param request FastifyRequest with id user in the query.
 * @param reply FastifyReply for sending responses.
 */
  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { id } = request.params as any;
      const data = await PricingHistoryService.getByOne({ id });

      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados."
        });
      }

      const { affected } = await PricingHistoryService.deletePermanently(id);

      if (!affected) {
        return reply.status(409).send({
          success: false,
          message: "Não foi possível excluir o registro."
        });
      }

      reply.status(200).send({
        success: true,
        message: "O registro foi deletado."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

}
