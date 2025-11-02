import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import PricingHistoryController from '../controllers/PricingHistoryController';
import { PricingHistorySchema } from '../schemas';

const pricingHistoryController = new PricingHistoryController();

const pricingHistoryRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/pricing_history",
        {
            preHandler: [verifyJWT]
        },
        pricingHistoryController.list);
    app.post("/pricing_history",
        {
            preHandler: [verifyJWT]
        },
        pricingHistoryController.create);
    app.patch("/pricing_history/:id",
        {
            preHandler: [verifyJWT]
        },
        pricingHistoryController.update);
    app.delete("/pricing_history/:id",
        {
            preHandler: [verifyJWT]
        },
        pricingHistoryController.delete);
    app.get("/pricing_history/:id",
        {
            preHandler: [verifyJWT]
        },
        pricingHistoryController.details);

    app.post("/pricing_history/impetus",
        {
            schema: PricingHistorySchema
        },
        pricingHistoryController.detailsPricingImpetus);

    done();
};

export default pricingHistoryRoutes;


