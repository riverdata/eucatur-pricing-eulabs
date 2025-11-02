import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import CategoryController from '../controllers/CategoryController';

const categoryController = new CategoryController();

const categoryRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/category",
        {
            preHandler: [verifyJWT]
        },
        categoryController.list);
    app.get("/category/sync",
        {
            preHandler: [verifyJWT]
        },
        categoryController.sync);
    done();
};

export default categoryRoutes;


