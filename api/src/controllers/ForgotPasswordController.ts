import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import MailService from "../services/MailService";
import bcrypt from "bcrypt";
import { config } from "../config";
import UserService from "../services/UserService";

export default class ForgotPasswordController {

  /**
   * Handles forgot password logic.
   * @param request FastifyRequest with email in the body.
   * @param reply FastifyReply for sending responses.
   */
  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { email } = request.body as any;

      const data = await UserService.getByOne({ email });
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Usuário não encontrado.",
        });
      }

      const resetPasswordToken = jwt.sign({ id: data.id }, config.salt as string, { expiresIn: "1h" });

      const resetLink = `${config.links.forgot_password}?token=${resetPasswordToken}`;

      await UserService.update(data.id, { resetPasswordToken });

      new MailService().send({
        to: email,
        subject: "[Precificação] Recupere sua senha",
        html: `
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperação de Senha</title>
          ${new MailService().style()}
      </head>
      <body>
          <div class="container">
              <h1>Plataforma de Precificação!</h1>
              <p>Prezado(a) ${data.name} ${data.surname},</p>
              <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se você não fez essa solicitação, por favor, ignore este e-mail.</p> 
              <p>Caso contrário, clique no botão abaixo para redefinir sua senha. Este link é válido por 1 hora:</p>
              <a href="${resetLink}" class="link">Redefinir Senha</a>
              <p class="footer">Se você não solicitou a recuperação de senha, nenhuma ação adicional é necessária.</p>
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
        message: "E-mail de recuperação enviado.",
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

  /**
   * Handles password update logic.
   * @param request FastifyRequest with token and new password in the body.
   * @param reply FastifyReply for sending responses.
   */
  async updatePassword(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { token, password } = request.body as any;

      const data = await UserService.getByOne({ resetPasswordToken: token });
      if (!data) {
        return reply.status(404).send({
          success: true,
          message: "O usuário não foi encontrado.",
        });
      }

      await UserService.update(data.id, { password: bcrypt.hashSync(password, 10), resetPasswordToken: '' });

      reply.status(200).send({
        success: true,
        message: "Senha atualizada com sucesso.",
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }
}
