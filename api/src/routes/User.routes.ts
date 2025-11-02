import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { verifyJWT } from "../utils/JwtVerifyAsync";

import { UserSchema, UserSchemaUpdate } from '../schemas';
import UserController from "../controllers/UserController";

const userController = new UserController();

const userRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.get("/users",
    {
        preHandler: [verifyJWT]
    },
    userController.list);

    app.post("/users",
        {
            schema: UserSchema,
            preHandler: [verifyJWT]
        },
        userController.create);

    app.delete("/users/:id",
        {
            preHandler: [verifyJWT]
        },
        userController.delete);

    app.get("/users/:id",
        {
            preHandler: [verifyJWT]
        },
        userController.details);

    app.patch("/users/:id",
        {
            schema: UserSchemaUpdate,
            preHandler: [verifyJWT]
        },
        userController.update);

    app.post(
        "/users/:id/email-confirmation",
        {
            preHandler: [verifyJWT]
        },
        userController.sendEmailConfirmation
    );

    app.post("/account/active",
        userController.activeAccount);

    done();
};

export default userRoutes;


