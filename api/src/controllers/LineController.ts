import type { FastifyReply, FastifyRequest } from "fastify";
import LineService from "../services/LineService";
import ExternalService from "../external_service/ExternalService";
import { ExternalLine } from "../external_service/interfaces/ExternalLine";

export default class LineController {

  /**
   * Handles list lines logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await LineService.getAll();
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

  /**
   * Handles update user logic.
   * @param request FastifyRequest with user data in the body.
   * @param reply FastifyReply for sending responses.
   */
  async sync(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await ExternalService.getLineAll();
      if (!data.data.lines || data.data.pagination.amount_records === 0) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados.",
        });
      }
      const totalItens = data.data.lines.length;
      
      let dataReturn = []
      let dataUpdate = data.data.lines.map((item: ExternalLine) => {
        return {
          description: `${item.line_code} - ${item.line_description}`.trim().toUpperCase(),
          line_id: item.line_id,
          line_code: item.line_code.trim().toUpperCase(),
          line_description: item.line_description.trim().toUpperCase(),
          company_code: item.company_code.trim().toUpperCase(),
          company_name: item.company_name.trim().toUpperCase(),
          line_status: item.line_status.trim().toUpperCase(),
          line_class: item.class.map(item => item.class_code),
          line_total_km: item.line_total_km,
        }
      })
      for (let index = 0; index < totalItens; index++) {
        let response = await LineService.getByLineCode(dataUpdate[index].line_code);
        
        if (!response) {
          response = await LineService.create(dataUpdate[index]);
          dataReturn.push(response)
        } else {
          response = await LineService.update(response.id, dataUpdate[index]);
        }
        
      }

      reply.status(200).send({
        success: true,
        data: dataReturn,
        message: "Dados Sincronizados com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

}
