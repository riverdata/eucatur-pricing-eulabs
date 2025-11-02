import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";
import DepartmentController from '../controllers/DepartmentController';

const departmentController = new DepartmentController();

const departmentRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/department",
        {
            preHandler: [verifyJWT]
        },
        departmentController.list);
    app.post("/department",
        {
            preHandler: [verifyJWT]
        },
        departmentController.create);
    app.patch("/department/:id",
        {
            preHandler: [verifyJWT]
        },
        departmentController.update);
    app.delete("/department/:id",
        {
            preHandler: [verifyJWT]
        },
        departmentController.delete);
    app.get("/department/:id",
        {
            preHandler: [verifyJWT]
        },
        departmentController.details);
    done();
};

export default departmentRoutes;


