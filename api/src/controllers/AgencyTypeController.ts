import type { FastifyReply, FastifyRequest } from "fastify";
import AgencyTypeService from "../services/AgencyTypeService";

export default class AgencyTypeController {

  /**
   * Handles routes points lines logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await AgencyTypeService.getAll();
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
