import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "../config";

const optionsDataSource = {
  type: "postgres",
  ...config.database,
  synchronize: false,
  logging: false,
  ssl: config.ssl,
  extra: config.extra,
  entities: [
    (config.isProduction || config.isStaging)
      ? "dist/entities/**/*.entity.js"
      : "src/entities/**/*.entity.ts",
  ],
  migrations: [
    (config.isProduction || config.isStaging)
      ? "dist/database/migrations/**/*.js"
      : "src/database/migrations/**/*.ts",
  ],
} as DataSourceOptions;
const AppDataSource = new DataSource(optionsDataSource);

export { AppDataSource };
