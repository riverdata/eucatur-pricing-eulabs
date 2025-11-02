import { FastifySchema } from 'fastify';

const UserSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' }
      }
    }
  }
};

const UserSchemaUpdate: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' }
    }
  },
  response: {
    204: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' }
      }
    }
  }
};

export {
  UserSchema,
  UserSchemaUpdate
}