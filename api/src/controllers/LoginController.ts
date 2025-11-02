import bcrypt from "bcrypt";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { config } from "../config";
import UserService from "../services/UserService";

export default class LoginController {
  
    /**
   * Handles login logic.
   * @param request FastifyRequest with email, password and time in the body.
   * @param reply FastifyReply for sending responses.
   */
  async exec(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { email, password, time } = request.body as any;

      const data = await UserService.getByOnePassWord({ email });
      if (!data) {
        return reply.status(401).send({
          success: false,
          message: "Usuário ou senha incorretos. Tente novamente!",
        });
      }

      if(data.status === 'inactive' || data.status === 'pending') {
        return reply.status(403).send({
          success: false,
          message: "Você não tem permissão para acessar o sistema!"
        });
      }

      const isPasswordMatched = bcrypt.compareSync(password, data.password);
      if (!isPasswordMatched) {
        return reply.status(401).send({
          success: false,
          message: "Usuário ou senha incorretos. Tente novamente!"
        });
      }

      let expires = '24h'
      if (time) expires = '30d'
      const token = jwt.sign({ id: data.id }, String(config.salt), { expiresIn: expires });

      reply.status(200).send({
        success: true,
        data: {
          token,
          user: {
            createdAt: data.createdAt,
            email: data.email,
            id: data.id,
            name: data.name,
            role: data.role,
            status: data.status,
            statusText: data.statusText,
            surname: data.surname
          }
        },
        message: "Usuário logado!"

      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }
}
