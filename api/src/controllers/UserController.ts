import bcrypt from "bcrypt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { UserRole, UserStatus } from "../entities";
import MailService from "../services/MailService";
import { config } from "../config";
import jwt from "jsonwebtoken";
import UserService from "../services/UserService";

export default class UserController {

  /**
  * Handles list users logic.
  * @param request FastifyRequest.
  * @param reply FastifyReply for sending responses.
  */

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await UserService.getAll();

      reply.status(200).send({
        success: true,
        data: data,
        message: "Usuários encontrados com sucesso!"
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

  /**
   * Handles create new user logic.
   * @param request FastifyRequest with new user data in the body.
   * @param reply FastifyReply for sending responses.
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {

      const body = request.body as any;
      const { email } = body;

      const isUserExists = await UserService.getByOne({ email });
      if (isUserExists) {
        return reply.status(409).send({
          success: false,
          message: "Já existe uma conta com o e-mail informado."
        });
      }

      const role = body.role as any ?? UserRole.USER;
      const { id, name, surname } = await UserService.create(body, role)

      const activationToken = jwt.sign({ id }, config.salt, {
        expiresIn: "24h",
      });

      await UserService.update(id, { activationToken });

      const webClientUrl = `${config.links.active_account}?token=${activationToken}`;

      new MailService().send({
        to: email,
        subject: "[Precificação] Ative sua conta",
        html: `
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ativação de Conta</title>
          ${new MailService().style()}
      </head>
      <body>
          <div class="container">
              <h1>Bem-vindo(a) à Plataforma de Precificação!</h1>
              <p>Prezado(a) ${name} ${surname},</p>
              <p>Para ativar sua conta, por favor, clique no botão abaixo. Este link é válido por 24 horas:</p>
              <a href="${webClientUrl}" class="link">Ativar Conta</a>
              <p class="footer">Se você não solicitou esta ativação, por favor, ignore este e-mail.</p>
              <p class="footer">Atenciosamente,<br>
              <img src="cid:logoImage" alt="Eucatur"/>
              </p>
          </div>
      </body>
      </html>
      `,
      });
      const data = await UserService.getByOne({ id });
      return reply.status(200).send({
        success: true,
        data: data,
        message: "Usuário criado com sucesso."
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
      const data = await UserService.getByOne({ id });

      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "O usuário não foi encontrado."
        });
      }

      const { affected } = await UserService.delete(id);

      if (!affected) {
        return reply.status(409).send({
          success: false,
          message: "Não foi possível excluir o usuário."
        });
      }

      await UserService.update(id, { status: 'inactive' });

      reply.status(200).send({
        success: true,
        message: "O usuário foi deletado."
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
  async details(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { id } = request.params as any;

      const data = await UserService.getByOne({ id });
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "O usuário não foi encontrado."
        });
      }

      reply.status(200).send({
        success: true,
        data: data,
        message: "Usuário encontrado."
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
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { id } = request.params as any;
      const { name, email, surname, status, role, department } = request.body as any;

      const data = await UserService.getByOne({ id });
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "O usuário não foi encontrado."
        });
      }
      if(email){
        const isUserExists = await UserService.getByEmail(email, id);
        if (isUserExists) {
          return reply.status(409).send({
            success: false,
            message: "Já existe uma conta com o e-mail informado."
          });
        }
      }

      await UserService.update(data.id, { name, email, surname, status, role, department });

      reply.status(200).send({
        success: true,
        data: { ...data, name, email, surname, status, role },
        message: "Usuário atualizado com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

  /**
   * Handles send email confirmation logic.
   * @param request FastifyRequest with id user in the params.
   * @param reply FastifyReply for sending responses.
   */
  async sendEmailConfirmation(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { id } = request.params as any;

      const data = await UserService.getByOne({ id });
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "O usuário não foi encontrado."
        });
      }

      const { email, name, surname } = data;
      const activationToken = jwt.sign({ id }, config.salt, {
        expiresIn: "24h",
      });

      await UserService.update(id, { activationToken });

      const webClientUrl = `${config.links.active_account}?token=${activationToken}`;

      new MailService().send({
        to: email,
        subject: "[Precificação] Ative sua conta",
        html: `
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ativação de Conta</title>
          ${new MailService().style()}
      </head>
      <body>
          <div class="container">
              <h1>Bem-vindo(a) à Plataforma de Precificação!</h1>
              <p>Prezado(a) ${name} ${surname},</p>
              <p>Para ativar sua conta, por favor, clique no botão abaixo. Este link é válido por 24 horas:</p>
              <a href="${webClientUrl}" class="link">Ativar Conta</a>
              <p class="footer">Se você não solicitou esta ativação, por favor, ignore este e-mail.</p>
              <p class="footer">Atenciosamente,<br>
              <img src="cid:logoImage" alt="Eucatur"/>
              </p>
          </div>
      </body>
      </html>
      `
      });

      reply.status(200).send({
        success: true,
        message: "E-mail enviado com sucesso!"
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
  async activeAccount(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { token, password } = request.body as any;

      const data = await UserService.getByOne({ activationToken: token });
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "O usuário não foi encontrado."
        });
      }

      await UserService.update(data.id, { password: bcrypt.hashSync(password, 10), activationToken: "", status: UserStatus.ACTIVE });

      reply.status(200).send({
        success: true,
        message: "Sua conta foi ativada com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }
}
