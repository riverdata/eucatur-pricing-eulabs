import { FastifySchema } from 'fastify';

const PricingHistorySchema: FastifySchema = {
  body: {
    type: 'object',
    required: [
      'pricing_code',
      'sale_at',
      'travel_id',
      'line_code',
      'sectional_code_origin',
      'sectional_code_destination'
    ],
    properties: {
      pricing_code: { type: 'string' },
      sale_at: { type: 'string', format: 'date-time' },
      travel_id: { type: 'string' },
      line_code: { type: 'string' },
      sectional_code_origin: { type: 'string' },
      sectional_code_destination: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            agencies: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  agency_id: { type: 'string' },
                  agency_description: { type: 'string' },
                  agency_code: { type: 'string' },
                  agency_status: { type: 'string' },
                  agency_type: { type: 'string' },
                  agency_type_code: { type: 'string' }
                }
              }
            },
            fixedPrice: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  seatType: { type: 'string' },
                  price: { type: 'number' }
                },
                required: ['seatType', 'price']
              }
            },
            adjustedPrice: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  seat: { type: 'string' },
                  seatType: { type: 'string' },
                  price: { type: 'number' }
                }
              }
            }
          },
          required: ['fixedPrice', 'adjustedPrice']
        }
      },
      required: ['success', 'message']
    }
  }
};

export {
  PricingHistorySchema
}
