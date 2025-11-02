import type { FastifyReply, FastifyRequest } from "fastify";
import CategoryService from "../services/CategoryService";
import ExternalService from "../external_service/ExternalService";
import { ExternalClass } from "../external_service/interfaces/ExternalClass";

export default class CategoryController {

  /**
   * Handles list Categorys logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await CategoryService.getAll();
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

      const data = await ExternalService.getClassAll();
      
      if (!data.data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados.",
        });
      }

      let dataUpdate = data.data.classes.map((item: ExternalClass) => {
        return {
          description: `${item.class_code} - ${item.class_description}`.trim().toUpperCase(),
          class_code: item.class_code.trim().toUpperCase(),
          class_description: item.class_description.trim().toUpperCase()
        }
      })
      for (let index = 0; index < dataUpdate.length; index++) {
        let response = await CategoryService.getByClassCode(dataUpdate[index].class_code);

        if (!response) {
          response = await CategoryService.create(dataUpdate[index]);
        } else {
          response = await CategoryService.update(response.id, dataUpdate[index]);
        }
        dataUpdate[index] = response
      }

      reply.status(200).send({
        success: true,
        data: dataUpdate,
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
