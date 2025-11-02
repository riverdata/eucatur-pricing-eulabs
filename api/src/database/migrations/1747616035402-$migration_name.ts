import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1747616035402 implements MigrationInterface {
    name = ' $migrationName1747616035402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "daysAdvance"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "timePurchase"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "timePurchase" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "timePurchase"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "timePurchase" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "daysAdvance" character varying NOT NULL`);
    }

}
