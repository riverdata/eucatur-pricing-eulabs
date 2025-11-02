import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  isDevelopment: process.env.NODE_ENV == "development",
  isStaging: process.env.NODE_ENV == "staging",
  isProduction: process.env.NODE_ENV == "production",
  apiIntegraImpetus: {
    baseUrl: process.env.API_IMPETUS_URL,
    apiKey: process.env.API_IMPETUS_KEY
  },
  salt: process.env.JWT_SECRET || "",
  links: {
    forgot_password: process.env.WEB_URL_FORGOT_PASSWORD || "",
    active_account: process.env.WEB_URL_ACTIVE_ACCOUNT || "",
  },
  database: {
    host: process.env.DB_HOST || "",
    port: Number(process.env.DB_PORT || ""),
    username: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_DATABASE || "",
  },
  databasePricing: {
    host: process.env.DB_HOST_PRICING || "",
    port: Number(process.env.DB_PORT_PRICING || ""),
    username: process.env.DB_USER_PRICING || "",
    password: process.env.DB_PASS_PRICING || "",
    database: process.env.DB_DATABASE_PRICING || "",
  },
  baseApiPython: process.env.BASE_API_PYTHON || "",
  ssl: process.env.NODE_ENV_BD !== "comSSL" ? false : true,
  extra: process.env.NODE_ENV_BD !== "comSSL" ? {} : {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  mail: {
    host: process.env.MAIL_HOST || "",
    port: Number(process.env.MAIL_PORT || ""),
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
  },
};
