import type { FastifyReply, FastifyRequest } from "fastify";
import DepartmentService from "../services/DepartmentService";

export default class DepartmentController {

  /**
   * Handles routes points lines logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await DepartmentService.getAll();

      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados.",
        });
      }

      if (data.length === 0) {
        return reply.status(200).send({
          success: true,
          data: [],
          message: "Nenhum departamento encontrado!",
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
   * Handles details department logic.
   * @param request FastifyRequest with id department in the query.
   * @param reply FastifyReply for sending responses.
   */
    async details(request: FastifyRequest, reply: FastifyReply) {
      try {
  
        const { id } = request.params as any;
  
        const data = await DepartmentService.getByOne({ id });
        if (!data) {
          return reply.status(404).send({
            success: false,
            message: "O departamento não foi encontrado."
          });
        }
  
        reply.status(200).send({
          success: true,
          data: data,
          message: "Departamento encontrado."
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
      const { description, manager } = request.body as any;

      const data = await DepartmentService.getByOne({ description: description })

      if (data) {
        return reply.status(400).send({ success: false, message: 'Já existe um registro com essa informação' })
      }

      const { id } = await DepartmentService.create({ description, manager })

      reply.status(201).send({ success: true, data: { id, description, manager }, message: 'Criado com sucesso.' })

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

      const { description, manager } = request.body as any;
      const { id } = request.params as any;

      const data = await DepartmentService.getByOne({ description: description })
      if (data && data.id !== id) {
        return reply.status(404).send({
          success: false,
          message: "Já existe registro com estas informações."
        });
      }

      await DepartmentService.update(id, { description, manager });

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
      const data = await DepartmentService.getByOne({ id });

      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados."
        });
      }

      const { affected } = await DepartmentService.delete(id);

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
