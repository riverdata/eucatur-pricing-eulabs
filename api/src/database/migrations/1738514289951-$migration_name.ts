import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1738514289951 implements MigrationInterface {
    name = ' $migrationName1738514289951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus_stop" ADD CONSTRAINT "UQ_9e9ace2404a1936099dfbeb315b" UNIQUE ("sectional_code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus_stop" DROP CONSTRAINT "UQ_9e9ace2404a1936099dfbeb315b"`);
    }

}
