import { MigrationInterface, QueryRunner } from "typeorm";

export class $migrationName1734897117343 implements MigrationInterface {
    name = ' $migrationName1734897117343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('superadmin', 'admin', 'employee')`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'pending', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "activationToken" character varying, "resetPasswordToken" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'employee', "status" "public"."user_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "weight" double precision, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4e72ae40c3fbd7711ccb380ac17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "route_points" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "origin" character varying NOT NULL, "destination" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9684d129d71ff38906e7cb08c68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "line" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "line" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_89a8c9de90ce9ca2a2cb00a5e0f" UNIQUE ("line"), CONSTRAINT "PK_3d944a608f62f599dfe688ff2b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "user" ("id", "name", "surname", "email", "password", "activationToken", "resetPasswordToken", "role", "status", "createdAt", "updatedAt", "deletedAt") SELECT 'da047d3a-0ec0-4a14-90e5-4b82d541f2f6', 'Riverdata', 'Administrador', 'admin@riverdata.com.br', '$2b$10$SGYdpx6rFnN3MjgSG.9PquNwMXopY0cYfYX6Gm7EwSzMMuvPPldYS', NULL, NULL, 'superadmin', 'active', '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL WHERE NOT EXISTS (SELECT 1 FROM "user" WHERE id='da047d3a-0ec0-4a14-90e5-4b82d541f2f6');
        `);
        await queryRunner.query(`INSERT INTO "user" ("id", "name", "surname", "email", "password", "activationToken", "resetPasswordToken", "role", "status", "createdAt", "updatedAt", "deletedAt") SELECT '39891321-691f-4e26-8b49-f66f35f0bb7e', 'Eucatur', 'Administrador', 'admin@eucatur.com.br', '$2b$10$E2t5ofVtzKIQvIfsI9hnaekehPxIozvIQwYhzkm/xxw/kcrbmj146', NULL, NULL, 'admin', 'active', '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL WHERE NOT EXISTS (SELECT 1 FROM "user" WHERE id='39891321-691f-4e26-8b49-f66f35f0bb7e');
        `);
        await queryRunner.query(`INSERT INTO "seat" ("description", "weight", "createdAt", "updatedAt", "deletedAt") VALUES ('Poltrona Convencional', 0, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Executiva', 0.03, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Leito', 0.25, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Leito Conjugado', 0.2, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Mulher', 0.08, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Conforto', 0.1, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Panorâmica', 0.15, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "line"`);
        await queryRunner.query(`DROP TABLE "route_points"`);
        await queryRunner.query(`DROP TABLE "seat"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
