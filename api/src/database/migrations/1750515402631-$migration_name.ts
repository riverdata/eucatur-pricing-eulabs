import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1750515402631 implements MigrationInterface {
    name = ' $migrationName1750515402631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" ADD "line_backup" smallint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_tb_precificacao" smallint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "line" ADD "line_lambdas" smallint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_lambdas"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_tb_precificacao"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_backup"`);
    }

}
