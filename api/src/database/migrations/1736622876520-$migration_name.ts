import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1736622876520 implements MigrationInterface {
    name = ' $migrationName1736622876520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" ADD "total_routes" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "total_routes"`);
    }

}
