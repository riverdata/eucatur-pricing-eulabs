import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1762117391162 implements MigrationInterface {
    name = ' $migrationName1762117391162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "managerId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('MasterAdmin', 'AdminManager', 'User')`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'pending', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "departmentId" uuid, "password" character varying, "activationToken" character varying, "resetPasswordToken" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'User', "status" "public"."user_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "weight" double precision, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4e72ae40c3fbd7711ccb380ac17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "line" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying, "line_id" integer NOT NULL, "line_code" character varying NOT NULL, "line_description" character varying NOT NULL, "company_code" character varying, "company_name" character varying, "line_status" character varying, "line_total_km" character varying NOT NULL DEFAULT '0', "line_class" jsonb NOT NULL DEFAULT '[]', "line_total_routes" integer NOT NULL DEFAULT '0', "line_total_services" integer NOT NULL DEFAULT '0', "line_backup" smallint NOT NULL DEFAULT '0', "line_tb_precificacao" smallint NOT NULL DEFAULT '0', "line_lambdas" smallint NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_2c79798f358b23889749b42e1d6" UNIQUE ("line_id"), CONSTRAINT "UQ_330e835442290ecbcfbbcb7884d" UNIQUE ("line_code"), CONSTRAINT "PK_3d944a608f62f599dfe688ff2b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pricing_history_status_enum" AS ENUM('pending_approval', 'active', 'expired', 'inactive', 'scheduled')`);
        await queryRunner.query(`CREATE TABLE "pricing_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pricing_code" character varying NOT NULL, "description" character varying NOT NULL, "lineId" uuid, "timePurchase" jsonb NOT NULL, "itineraries" text NOT NULL, "forecastDate" jsonb NOT NULL, "purchaseDates" jsonb NOT NULL, "optionalDetails" text NOT NULL, "servicesEnd" text NOT NULL, "status" "public"."pricing_history_status_enum" NOT NULL DEFAULT 'pending_approval', "activationDate" TIMESTAMP NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_3c0ef99fa12756de217ae0c1331" UNIQUE ("pricing_code"), CONSTRAINT "UQ_149b20fb6456b5a9bd71f1f3fad" UNIQUE ("description"), CONSTRAINT "PK_07a306b951b2edd2dd01101aeb8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "factor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "factor_code" character varying NOT NULL, "factor_description" character varying NOT NULL, "factor_weight" integer NOT NULL, "factor_weight_add" jsonb NOT NULL DEFAULT '[]', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_bd58c9ca8df6ccead82b332e936" UNIQUE ("description"), CONSTRAINT "UQ_4c89dfc001297d694408945953f" UNIQUE ("factor_description"), CONSTRAINT "PK_474c0e9d4ca1c181f178952187d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "agency_id" integer NOT NULL, "agency_code" character varying NOT NULL, "agency_description" character varying NOT NULL, "agency_boarding_disembarking" character varying NOT NULL, "agency_typeId" uuid NOT NULL, "agency_status" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_a4ace760065e4089618eb12600a" UNIQUE ("agency_code"), CONSTRAINT "PK_ab1244724d1c216e9720635a2e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agency_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "agency_code" character varying NOT NULL, "agency_type" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_81220e25ccd86a5a02a8c3619ef" UNIQUE ("agency_type"), CONSTRAINT "PK_05ddd33182db219da28adc739d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "class_code" character varying NOT NULL, "class_description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_2147eb9946aa96094b7f78b1954" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD CONSTRAINT "FK_9e32601ad5df0cc689aebf98fd2" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agency" ADD CONSTRAINT "FK_b46665e21b5dbb63ae57cd4521e" FOREIGN KEY ("agency_typeId") REFERENCES "agency_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    
        await queryRunner.query(`INSERT INTO "user" ("id", "name", "surname", "email", "password", "activationToken", "resetPasswordToken", "role", "status", "createdAt", "updatedAt", "deletedAt") SELECT '39891321-691f-4e26-8b49-f66f35f0bb7e', 'Eucatur', 'Administrador', 'admin@eucatur.com.br', '$2b$10$E2t5ofVtzKIQvIfsI9hnaekehPxIozvIQwYhzkm/xxw/kcrbmj146', NULL, NULL, 'MasterAdmin', 'active', '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL WHERE NOT EXISTS (SELECT 1 FROM "user" WHERE id='39891321-691f-4e26-8b49-f66f35f0bb7e');
        `);
        await queryRunner.query(`INSERT INTO "seat" ("description", "weight", "createdAt", "updatedAt", "deletedAt") VALUES ('Poltrona Convencional', 0, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Executiva', 0.03, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Leito', 0.25, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Leito Conjugado', 0.2, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Mulher', 0.08, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Conforto', 0.1, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL),('Poltrona Panorâmica', 0.15, '2024-11-23 21:41:25.167658', '2024-11-23 21:41:25.167658', NULL);
        `);
    
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency" DROP CONSTRAINT "FK_b46665e21b5dbb63ae57cd4521e"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP CONSTRAINT "FK_9e32601ad5df0cc689aebf98fd2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_2147eb9946aa96094b7f78b1954"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "agency_type"`);
        await queryRunner.query(`DROP TABLE "agency"`);
        await queryRunner.query(`DROP TABLE "factor"`);
        await queryRunner.query(`DROP TABLE "pricing_history"`);
        await queryRunner.query(`DROP TYPE "public"."pricing_history_status_enum"`);
        await queryRunner.query(`DROP TABLE "line"`);
        await queryRunner.query(`DROP TABLE "seat"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "department"`);
    }

}
