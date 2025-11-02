import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import FactorController from '../controllers/FactorController';

const factorController = new FactorController();

const factorRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/factor",
        {
            preHandler: [verifyJWT]
        },
        factorController.list);
    app.post("/factor",
        {
            preHandler: [verifyJWT]
        },
        factorController.create);
    app.patch("/factor/:id",
        {
            preHandler: [verifyJWT]
        },
        factorController.update);
    app.delete("/factor/:id",
        {
            preHandler: [verifyJWT]
        },
        factorController.delete);
    done();
};

export default factorRoutes;


