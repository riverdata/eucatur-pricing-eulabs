import type { FastifyReply, FastifyRequest } from "fastify";
import AgencyService from "../services/AgencyService";
import ExternalService from "../external_service/ExternalService";
import { ExternalAgency } from "../external_service/interfaces/ExternalAgency";
import AgencyTypeService from "../services/AgencyTypeService";
import { Agency } from "../entities";

export default class AgencyController {

  /**
   * Handles routes points lines logic.
   * @param request FastifyRequest.
   * @param reply FastifyReply for sending responses.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await AgencyService.getAll();
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados disponiveis.",
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
 * Handles routes points lines logic.
 * @param request FastifyRequest.
 * @param reply FastifyReply for sending responses.
 */
  async listActive(request: FastifyRequest, reply: FastifyReply) {
    try {

      const data = await AgencyService.getAllActive();
      if (!data) {
        return reply.status(404).send({
          success: false,
          message: "Não foram encontrados dados disponiveis.",
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
 * Handles update user logic.
 * @param request FastifyRequest with user data in the body.
 * @param reply FastifyReply for sending responses.
 */
  async sync(request: FastifyRequest, reply: FastifyReply) {
    try {

      const dataTotal = await ExternalService.getAgencyAll(1);
      const totalPageAgency = dataTotal.data.pagination?.amount_pages

      let dataReturn = []
      let agencyTypeCode = 1;
      for (let page = 1; page <= totalPageAgency; page++) {

        console.log('page', page);
        const data = await ExternalService.getAgencyAll(page);
        console.log(data);
        const temdados = data.data ? data.data.pagination?.amount_records : 0;

        console.log('total_dados:', temdados);
        if (!data.data || data.data.pagination.amount_records === 0) {
          continue;
        }


        let dataUpdate = data.data.agencies.map((item: ExternalAgency) => {
          return {
            description: `${item.agency_code} - ${item.agency_description}`,
            agency_id: item.agency_id,
            agency_code: item.agency_code.trim().toUpperCase(),
            agency_description: item.agency_description.trim().toUpperCase(),
            agency_boarding_disembarking: item.agency_boarding_disembarking.trim().toUpperCase(),
            agency_type: item.agency_type.trim().toUpperCase(),
            agency_status: item.agency_status.trim().toUpperCase(),
          }
        })

        for (let index = 0; index < dataUpdate.length; index++) {
          var agencyType = await AgencyTypeService.getByAgencyType(dataUpdate[index].agency_type);
          if (!agencyType) {
            agencyType = await AgencyTypeService.create({
              description: `${agencyTypeCode} - ${dataUpdate[index].agency_type}`.trim().toUpperCase(),
              agency_code: String(agencyTypeCode),
              agency_type: dataUpdate[index].agency_type
            });
            agencyTypeCode++
          }
          let response: any = await AgencyService.getByAgencyCode(dataUpdate[index].agency_code);
          if (!response) {
            response = await AgencyService.create({
              description: `${dataUpdate[index].agency_code} - ${dataUpdate[index].agency_description}`,
              agency_id: dataUpdate[index].agency_id,
              agency_code: dataUpdate[index].agency_code.trim().toUpperCase(),
              agency_description: dataUpdate[index].agency_description.trim().toUpperCase(),
              agency_boarding_disembarking: dataUpdate[index].agency_boarding_disembarking.trim().toUpperCase(),
              agency_type: agencyType,
              agency_status: dataUpdate[index].agency_status.trim().toUpperCase(),
            });
            dataReturn.push(response)
          } else {
            await AgencyService.update(response.id, {
              description: `${dataUpdate[index].agency_code} - ${dataUpdate[index].agency_description}`,
              agency_id: dataUpdate[index].agency_id,
              agency_code: dataUpdate[index].agency_code.trim().toUpperCase(),
              agency_description: dataUpdate[index].agency_description.trim().toUpperCase(),
              agency_boarding_disembarking: dataUpdate[index].agency_boarding_disembarking.trim().toUpperCase(),
              agency_type: agencyType,
              agency_status: dataUpdate[index].agency_status.trim().toUpperCase(),
            });
          }
        }

      }

      reply.status(200).send({
        success: true,
        data: dataReturn,
        message: "Dados Sincronizados com sucesso."
      });

    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno no servidor."
      });
    }
  }

}
