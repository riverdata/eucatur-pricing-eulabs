import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1746918142623 implements MigrationInterface {
    name = ' $migrationName1746918142623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "salesFrequencies"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "purchaseDates" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "activationDate"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "activationDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "expiresAt" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "activationDate"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "activationDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "purchaseDates"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "salesFrequencies" jsonb NOT NULL`);
    }

}
