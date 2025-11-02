import type { FastifyReply, FastifyRequest } from "fastify";
import { ExternalServices } from "../external_service/interfaces/ExternalServices";
import ExternalService from "../external_service/ExternalService";
import { ExternalPrice } from "../external_service/interfaces/ExternalPrice";

export default class ExternalServicesController {

  /**
 * Handles update user logic.
 * @param request FastifyRequest with user data in the body.
 * @param reply FastifyReply for sending responses.
 */
  async servicesByLineCode(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { lineCode } = request.params as any;

      const data = await ExternalService.getServiceAll(lineCode, 1);
      const temdados = data.data ? data.data.pagination?.amount_records : 0;

      console.log('dados:', temdados);
      if (!data.data || data.data.pagination.amount_records === 0) {
        return reply.status(200).send({
          success: false,
          message: "Não foram encontrados dados disponíveis.",
          data: []
        });
      }
      const pageTotal = data.data.pagination.amount_pages
      let serviceReturn: ExternalServices[] = []

      for (let page = 1; page <= pageTotal; page++) {

        const data = await ExternalService.getServiceAll(lineCode, page);

        let dataUpdate = data.data.services.map((item: ExternalServices) => {
          return {
            travel_id: item.travel_id.trim().toUpperCase(),
            service_code: item.service_code.trim().toUpperCase(),
            service_departure_date: item.service_departure_date.trim().toUpperCase(),
            service_departure_time: item.service_departure_time.trim().toUpperCase(),
            service_direction: item.service_direction.trim().toUpperCase(),
            service_type: item.service_type.trim().toUpperCase(),
            service_status: item.service_status.trim().toUpperCase(),
            service_seats: item.service_seats.trim().toUpperCase(),
            class: item.class.map(item => item.class_code),
            sections: item.sections,
            frequency: item.frequency[0],
          }
        })
        serviceReturn = [...serviceReturn, ...dataUpdate]
      }

      reply.status(200).send({
        success: true,
        data: serviceReturn,
        message: "Dados Encontrados com sucesso."
      });

    } catch (error) {
      console.log(error)
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
  async priceBy(request: FastifyRequest, reply: FastifyReply) {
    try {

      const { lineCode, operationDate, class_code, secctional_origin_code = "", secctional_destiny_code = "" } = request.body as any;

      let dataUpdate: ExternalPrice[] = []
      if (secctional_origin_code != "" && secctional_destiny_code != "") {

        const data = await ExternalService.getPriceByAll(lineCode, operationDate, secctional_origin_code, secctional_destiny_code);
        if (!data.data) {
          return reply.status(404).send({
            success: false,
            message: "Não foram encontrados dados disponíveis.",
          });
        }
        const temdados = data.data.tariff.length;
        console.log('dados:', temdados);

        dataUpdate = data.data.tariff.map((item: ExternalPrice) => {
          return {
            class_code: item.class_code.trim().toUpperCase(),
            secctional_origin_code: item.secctional_origin_code.trim().toUpperCase(),
            secctional_origin_description: item.secctional_origin_description.trim().toUpperCase(),
            secctional_destiny_code: item.secctional_destiny_code.trim().toUpperCase(),
            secctional_destiny_description: item.secctional_destiny_description.trim().toUpperCase(),
            route_km: item.route_km,
            tariff_value: item.tariff_value,
            boarding_fee_value: item.boarding_fee_value,
            insurance_value: item.insurance_value,
            toll_value: item.toll_value,
            other_value: item.other_value,
            amount: item.amount
          }
        }).filter((price: ExternalPrice) => class_code.includes(price.class_code))




      } else {

        const data = await ExternalService.getPrice(lineCode, operationDate);
        if (!data.data) {
          return reply.status(404).send({
            success: false,
            message: "Não foram encontrados dados disponíveis.",
          });
        }
        const temdados = data.data.tariff.length;
        console.log('dados:', temdados);

        dataUpdate = data.data.tariff.map((item: ExternalPrice) => {
          return {
            class_code: item.class_code.trim().toUpperCase(),
            secctional_origin_code: item.secctional_origin_code.trim().toUpperCase(),
            secctional_origin_description: item.secctional_origin_description.trim().toUpperCase(),
            secctional_destiny_code: item.secctional_destiny_code.trim().toUpperCase(),
            secctional_destiny_description: item.secctional_destiny_description.trim().toUpperCase(),
            route_km: item.route_km,
            tariff_value: item.tariff_value,
            boarding_fee_value: item.boarding_fee_value,
            insurance_value: item.insurance_value,
            toll_value: item.toll_value,
            other_value: item.other_value,
            amount: item.amount
          }
        }).filter((price: ExternalPrice) => class_code.includes(price.class_code))

      }

      reply.status(200).send({
        success: true,
        data: dataUpdate,
        message: "Dados Encontrados com sucesso."
      });

    } catch (error) {
      console.log(error)
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }
}
