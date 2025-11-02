import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import PricingController from '../controllers/PricingController';

const pricingController = new PricingController();

const pricingRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.post("/pricing/precision",
        {
            preHandler: [verifyJWT]
        },
        pricingController.precisionPython);

    done();
};

export default pricingRoutes;


