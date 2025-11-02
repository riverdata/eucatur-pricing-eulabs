import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1738506877071 implements MigrationInterface {
    name = ' $migrationName1738506877071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" DROP CONSTRAINT "UQ_89a8c9de90ce9ca2a2cb00a5e0f"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_kmtotal"`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line" ADD CONSTRAINT "UQ_330e835442290ecbcfbbcb7884d" UNIQUE ("line_code")`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_total_km" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_total_km"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_description"`);
        await queryRunner.query(`ALTER TABLE "line" DROP CONSTRAINT "UQ_330e835442290ecbcfbbcb7884d"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_code"`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_kmtotal" double precision`);
        await queryRunner.query(`ALTER TABLE "line" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line" ADD CONSTRAINT "UQ_89a8c9de90ce9ca2a2cb00a5e0f" UNIQUE ("line")`);
    }

}
