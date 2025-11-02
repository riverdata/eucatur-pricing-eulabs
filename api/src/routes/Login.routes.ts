import { FastifyInstance, FastifyPluginCallback } from 'fastify';

import ForgotPasswordController from "../controllers/ForgotPasswordController";
import LoginController from "../controllers/LoginController";
import { loginSchema, forgotPasswordSchema, updatePasswordSchema } from '../schemas';

const forgotPasswordController = new ForgotPasswordController();


const loginRoutes: FastifyPluginCallback = (app: FastifyInstance, options, done) => {

    app.post("/login",
        {
            schema: loginSchema
        }, 
        new LoginController().exec);

    app.post(
        "/account/forgot-password",
        {
            schema: forgotPasswordSchema
        },
        forgotPasswordController.forgotPassword
    );

    app.post(
        "/account/update-password",
        {
            schema: updatePasswordSchema
        },
        forgotPasswordController.updatePassword
    );

    done();
};

export default loginRoutes;


