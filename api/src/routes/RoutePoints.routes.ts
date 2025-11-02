import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import RoutePointsController from '../controllers/RoutePointsController';

const routePointsController = new RoutePointsController();

const routePointsRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/routePoints/line/:lineCode/origin/:originCode",
        {
            preHandler: [verifyJWT]
        },
        routePointsController.listDestinationByOriginAndLine);

    app.get("/routePoints/line/:lineCode",
        {
            preHandler: [verifyJWT]
        },
        routePointsController.listOriginByLine);
    done();
};

export default routePointsRoutes;


