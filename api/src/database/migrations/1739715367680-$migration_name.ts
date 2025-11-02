import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1739715367680 implements MigrationInterface {
    name = ' $migrationName1739715367680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency" ADD CONSTRAINT "UQ_a4ace760065e4089618eb12600a" UNIQUE ("agency_code")`);
        await queryRunner.query(`ALTER TABLE "agency_type" ADD CONSTRAINT "UQ_81220e25ccd86a5a02a8c3619ef" UNIQUE ("agency_type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency_type" DROP CONSTRAINT "UQ_81220e25ccd86a5a02a8c3619ef"`);
        await queryRunner.query(`ALTER TABLE "agency" DROP CONSTRAINT "UQ_a4ace760065e4089618eb12600a"`);
    }

}
