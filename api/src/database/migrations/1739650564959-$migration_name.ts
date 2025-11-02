import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1739650564959 implements MigrationInterface {
    name = ' $migrationName1739650564959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "travel_id"`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_total_services" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_total_services"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "travel_id" character varying NOT NULL`);
    }

}
