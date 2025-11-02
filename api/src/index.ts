import cors from "@fastify/cors";
import dotenv from "dotenv";
import Fastify from "fastify";

import { AppDataSource } from "./database/data-source";
import fastifyMultipart from "@fastify/multipart";
import http from "http";

import loginRoutes from "./routes/Login.routes";
import userRoutes from "./routes/User.routes";
import pricingRoutes from "./routes/Pricing.routes";
import lineRoutes from "./routes/Line.routes";
import routePointsRoutes from "./routes/RoutePoints.routes";
import seatRoutes from "./routes/Seat.routes";
import categoryRoutes from "./routes/Category.routes";
import agencyRoutes from "./routes/Agency.routes";
import agencyTypeRoutes from "./routes/AgencyType.routes";
import factorRoutes from "./routes/Factor.routes";
import externalServiceRoutes from "./routes/ExternalService.routes";
import departmentRoutes from "./routes/Department.routes";
import pricingHistoryRoutes from "./routes/PricingHistory.routes";


import { startPricingStatusJob } from './jobs/PricingHistoryServiceCron';

dotenv.config();
const PORT = 4001;

var pjson = require("../package.json");

const app  = Fastify({ logger: true });

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

app.get("/", (_, reply) =>
  reply.send(`PRECIFICAÇÃO EUCATUR API VERSION: ${pjson.version}`)
);

app.register(loginRoutes, { prefix: '/api' });
app.register(userRoutes, { prefix: '/api' });
app.register(pricingRoutes, { prefix: '/api' });
app.register(lineRoutes, { prefix: '/api' });
app.register(routePointsRoutes, { prefix: '/api' });
app.register(seatRoutes, { prefix: '/api' });
app.register(categoryRoutes, { prefix: '/api' });
app.register(agencyRoutes, { prefix: '/api' });
app.register(agencyTypeRoutes, { prefix: '/api' });
app.register(factorRoutes, { prefix: '/api' });
app.register(externalServiceRoutes, { prefix: '/api' });
app.register(departmentRoutes, { prefix: '/api' });
app.register(pricingHistoryRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await AppDataSource.initialize();

    app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      app.log.info(`Server listening at ${address}`);
    });

    const server = http.createServer();
    startPricingStatusJob();
    server.listen(PORT + 1);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
