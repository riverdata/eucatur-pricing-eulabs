import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import AgencyController from '../controllers/AgencyController';

const agencyController = new AgencyController();

const agencyRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/agency",
        {
            preHandler: [verifyJWT]
        },
        agencyController.list);    
    app.get("/agency/active",
        {
            preHandler: [verifyJWT]
        },
        agencyController.listActive);
    app.get("/agency/sync",
        {
            preHandler: [verifyJWT]
        },
        agencyController.sync);
    done();
};

export default agencyRoutes;


