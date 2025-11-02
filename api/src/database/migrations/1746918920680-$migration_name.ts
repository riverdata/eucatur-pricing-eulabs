import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1746918920680 implements MigrationInterface {
    name = ' $migrationName1746918920680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" RENAME COLUMN "frequencies" TO "forecastDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" RENAME COLUMN "forecastDate" TO "frequencies"`);
    }

}
