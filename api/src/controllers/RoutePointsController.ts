import type { FastifyReply, FastifyRequest } from "fastify";
import ExternalService from "../external_service/ExternalService";
import { ExternalItinerary } from "../external_service/interfaces/ExternalItinerary";
import LineService from "../services/LineService";
import { Line } from "../entities";

export default class RoutePointsController {

  /**
   * Handles routes points lines logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async listDestinationByOriginAndLine(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { lineCode, originCode } = request.params as any;

      const line = await LineService.getByLineCode(lineCode);
      if (!line) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados disponiveis.",
        });
      }

      let page = 1;
      const data = await ExternalService.getItineraryByLine(lineCode, page);
      if (!data.data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados disponiveis.",
        });
      }

      const dataReturn = data.data.itineraries.map((item: ExternalItinerary) => {
        return {
          description: `${item.destiny_sectional_code} - ${item.destiny_sectional_description}`.trim().toUpperCase(),
          routeRoint: {
            description: `${item.origin_sectional_code} - ${item.origin_sectional_description} X ${item.destiny_sectional_code} - ${item.destiny_sectional_description}`.trim().toUpperCase(),
            route_km: item.route_km,
            line: line,
            origin: {
              description: `${item.origin_sectional_code} - ${item.origin_sectional_description}`.trim().toUpperCase(),
              sectional_code: item.origin_sectional_code.trim().toUpperCase(),
              sectional_description: item.origin_sectional_description.trim().toUpperCase(),
            },
            destination: {
              description: `${item.destiny_sectional_code} - ${item.destiny_sectional_description}`.trim().toUpperCase(),
              sectional_code: item.destiny_sectional_code.trim().toUpperCase(),
              sectional_description: item.destiny_sectional_description.trim().toUpperCase(),
            }
          }
        }
      }).filter((item: any) => {
        return item.routeRoint.origin.sectional_code === originCode.trim().toUpperCase()
      })

      const uniqueSections = Array.from(
        new Map(dataReturn.map((item: any) => [item.description, item])).values()
      );

      reply.status(200).send({
        success: true,
        data: uniqueSections,
        message: "Dados encontrados com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

  /**
   * Handles routes points lines logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async listOriginByLine(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { lineCode } = request.params as any;
      if (!lineCode) {
        return reply.status(400).send({
          success: false,
          message: "LineCode indefinido!",
        });
      }

      const line = await LineService.getByLineCode(lineCode);
      if (!line) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados disponiveis.",
        });
      }

      let page = 1;
      const data = await ExternalService.getItineraryByLine(lineCode, page);

      if (!data.data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados disponiveis.",
        });
      }

      const totalItineraries = data.data.pagination?.amount_records;
      await LineService.update(line.id, { line_total_routes: totalItineraries });

      const dataReturn = data.data.itineraries.map((item: ExternalItinerary) => {
        return {
          description: `${item.origin_sectional_code} - ${item.origin_sectional_description}`.trim().toUpperCase(),
          sectional_code: item.origin_sectional_code.trim().toUpperCase(),
          sectional_description: item.origin_sectional_description.trim().toUpperCase(),
          line: line
        }
      })

      const uniqueSections = Array.from(
        new Map(dataReturn.map((item: any) => [item.description, item])).values()
      );

      reply.status(200).send({
        success: true,
        data: uniqueSections,
        message: "Dados encontrados com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

}
