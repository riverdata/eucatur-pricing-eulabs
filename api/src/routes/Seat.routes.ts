import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import SeatController from '../controllers/SeatController';

const seatController = new SeatController();

const seatRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/seats",
        {
            preHandler: [verifyJWT]
        },
        seatController.list);

    done();
};

export default seatRoutes;


