import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1738513316134 implements MigrationInterface {
    name = ' $migrationName1738513316134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "class_code" character varying NOT NULL, "class_description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "travel_id" character varying NOT NULL, "service_code" character varying NOT NULL, "service_departure_time" character varying NOT NULL, "service_direction" character varying NOT NULL, "service_type" character varying NOT NULL, "service_status" character varying NOT NULL, "service_seats" character varying NOT NULL, "lineId" uuid NOT NULL, "frequency" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "itinerary_kmtotal"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "total_routes"`);
        await queryRunner.query(`ALTER TABLE "bus_stop" ADD "sectional_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bus_stop" ADD "sectional_description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "route_km" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "amount" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "categoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line" ADD CONSTRAINT "UQ_2c79798f358b23889749b42e1d6" UNIQUE ("line_id")`);
        await queryRunner.query(`ALTER TABLE "line" ADD "company_code" character varying`);
        await queryRunner.query(`ALTER TABLE "line" ADD "company_name" character varying`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_status" character varying`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_total_routes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_total_km"`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_total_km" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD CONSTRAINT "FK_c9e049ff69acaa01eb08abbaa39" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_fa93acda075c10dc9613582ca60" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_fa93acda075c10dc9613582ca60"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP CONSTRAINT "FK_c9e049ff69acaa01eb08abbaa39"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_total_km"`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_total_km" double precision`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_total_routes"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_status"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "company_name"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "company_code"`);
        await queryRunner.query(`ALTER TABLE "line" DROP CONSTRAINT "UQ_2c79798f358b23889749b42e1d6"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_id"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "route_km"`);
        await queryRunner.query(`ALTER TABLE "bus_stop" DROP COLUMN "sectional_description"`);
        await queryRunner.query(`ALTER TABLE "bus_stop" DROP COLUMN "sectional_code"`);
        await queryRunner.query(`ALTER TABLE "line" ADD "total_routes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "itinerary_kmtotal" double precision`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
