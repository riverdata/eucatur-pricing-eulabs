import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1734907591959 implements MigrationInterface {
    name = ' $migrationName1734907591959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bus_stop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_52b2402e9c73fbc734fa960935a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "destination"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "origin"`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "originId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "destinationId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD CONSTRAINT "FK_fb798f9ac2b2ee9ea7b0239ab1e" FOREIGN KEY ("originId") REFERENCES "bus_stop"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD CONSTRAINT "FK_e58146ed4d37e4d9fda644decf0" FOREIGN KEY ("destinationId") REFERENCES "bus_stop"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route_points" DROP CONSTRAINT "FK_e58146ed4d37e4d9fda644decf0"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP CONSTRAINT "FK_fb798f9ac2b2ee9ea7b0239ab1e"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "destinationId"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "originId"`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "origin" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "destination" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "bus_stop"`);
    }

}
