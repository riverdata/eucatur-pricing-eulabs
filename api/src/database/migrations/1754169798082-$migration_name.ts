import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1754169798082 implements MigrationInterface {
    name = ' $migrationName1754169798082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "origin"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "destiny"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "itineraries"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "itineraries" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "optionalDetails"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "optionalDetails" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "servicesEnd"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "servicesEnd" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "servicesEnd"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "servicesEnd" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "optionalDetails"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "optionalDetails" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "itineraries"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "itineraries" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "destiny" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "origin" character varying NOT NULL`);
    }

}
