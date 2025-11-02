import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";

dotenv.config();

declare module "fastify" {
  interface FastifyRequest {
    userId?: { id: string };
  }
}

export const verifyJWT = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const token = request.headers.authorization?.replace("Bearer ", "") as string;

  if (!token) {
    return reply.status(401).send({
      success: false,
      message: "É necessário realizar login para acessar essa página.",
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("SECRET não está configurado nas variáveis de ambiente.");
  }

  try {
    const decoded = jwt.verify(token, secret as string) as JwtPayload;
    request.userId = decoded.id;
  } catch (err) {
    return reply.status(401).send({
      success: false,
      message: "Falha ao autenticar token. Realize o login novamente.",
    });
  }
};