import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import LineController from '../controllers/LineController';

const lineController = new LineController();

const lineRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/lines",
        {
            preHandler: [verifyJWT]
        },
        lineController.list);
    app.get("/lines/sync",
        {
            preHandler: [verifyJWT]
        },
        lineController.sync);

    done();
};

export default lineRoutes;


