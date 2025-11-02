import { FastifySchema } from 'fastify';

const loginSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["email", "password", "time"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", format: "password" },
      time: { type: "boolean" }
    }
  }
};

const forgotPasswordSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email" }
    }
  }
};

const updatePasswordSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["token", "password"],
    properties: {
      token: { type: "string" },
      password: { type: "string", minLength: 6 },
    }
  }
};

export {
  loginSchema,
  forgotPasswordSchema,
  updatePasswordSchema
}