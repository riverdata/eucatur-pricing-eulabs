import type { FastifyReply, FastifyRequest } from "fastify";
import FactorService from "../services/FactorService";
import { FactorRequestData } from "../entities/Factor.entity";

export default class FactorController {

  /**
   * Handles routes points lines logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await FactorService.getAll();
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados.",
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

  async create(request: FastifyRequest, reply: FastifyReply) {

    try {
      const formData = request.body as FactorRequestData

      const data = await FactorService.getByOne({description: formData.description})

      if (data) {
        return reply.status(400).send({ success: false, message: 'Já existe um registro com essa informação' })
      }

      await FactorService.create(formData)

      reply.status(201).send({ success: true, message: 'Criado com sucesso.' })

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

      const formData = request.body as FactorRequestData
      const { id } = request.params as any;

      const data = await FactorService.getByOne({description: formData.description})
      if (data && data.id !== id) {
        return reply.status(404).send({
          success: false,
          message: "Já existe registro com estas informações."
        });
      }

      await FactorService.update(id, formData);

      reply.status(201).send({
        success: true,
        message: "Atualizado com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
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
        const data = await FactorService.getByOne({ id });
  
        if (!data) {
          return reply.status(404).send({
            success: false,
            message: "Não foram encontrados dados."
          });
        }
  
        const { affected } = await FactorService.delete(id);
  
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
