import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1747182437736 implements MigrationInterface {
    name = ' $migrationName1747182437736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "factors"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "factors" jsonb NOT NULL`);
    }

}
