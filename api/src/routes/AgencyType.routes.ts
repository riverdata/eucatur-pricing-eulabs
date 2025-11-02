import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import AgencyTypeController from '../controllers/AgencyTypeController';

const agencyTypeController = new AgencyTypeController();

const agencyTypeRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/agencyType",
        {
            preHandler: [verifyJWT]
        },
        agencyTypeController.list);
    done();
};

export default agencyTypeRoutes;


