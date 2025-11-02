import type { FastifyReply, FastifyRequest } from "fastify";
import SeatService from "../services/SeatService";

export default class SeatController {

  /**
   * Handles list Seats logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await SeatService.getAll();
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados disponiveis.",
        });
      }
      
      reply.status(200).send({
        success: true,
        data: data,
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
