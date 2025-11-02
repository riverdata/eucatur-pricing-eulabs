import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1746926125947 implements MigrationInterface {
    name = ' $migrationName1746926125947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD "pricing_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD CONSTRAINT "UQ_3c0ef99fa12756de217ae0c1331" UNIQUE ("pricing_code")`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD CONSTRAINT "UQ_149b20fb6456b5a9bd71f1f3fad" UNIQUE ("description")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP CONSTRAINT "UQ_149b20fb6456b5a9bd71f1f3fad"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP CONSTRAINT "UQ_3c0ef99fa12756de217ae0c1331"`);
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP COLUMN "pricing_code"`);
    }

}
