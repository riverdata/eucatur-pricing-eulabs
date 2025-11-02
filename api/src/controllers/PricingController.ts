import type { FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { config } from "../config";
import fs from 'fs'

export default class PricingController {

  /**
   * Handles Perform precision with python file logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
  */
  async precisionPython(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { line, dateForecast, timePurchase, daysAdvance, origin, destination, tariff_value, route_km } = request.body as any;
      console.log('dados para prever', {
        linha: line.line_code,
        data_previsao: dateForecast,
        hora_compra: Number(timePurchase),
        dias_antecedencia: Number(daysAdvance),
        origem: origin,
        destino: destination,
        tarifa_base: Number(tariff_value),
        route_km: Number(route_km)
      })
      const response = await axios.post(`${config.baseApiPython}/previsao`, {
        linha: line.line_code,
        data_previsao: dateForecast,
        hora_compra: Number(timePurchase),
        dias_antecedencia: Number(daysAdvance),
        origem: origin,
        destino: destination,
        tarifa_base: Number(tariff_value),
        route_km: Number(route_km)
      });
      // Processando a resposta
      console.log('----------------------------------> Previsão Concluída! <---------------------------------');

      reply.status(200).send({
        success: true,
        data: response.data,
        message: "Dados Previstos."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: error
      });
    }
  }

}
