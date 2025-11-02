import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import ExternalServicesController from '../controllers/ExternalServicesController';

const externalServicesController = new ExternalServicesController();

const externalServiceRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/externalService/services/:lineCode",
        {
            preHandler: [verifyJWT]
        },
        externalServicesController.servicesByLineCode);
    app.post("/externalService/price",
        {
            preHandler: [verifyJWT]
        },
        externalServicesController.priceBy);
    done();
};

export default externalServiceRoutes;


