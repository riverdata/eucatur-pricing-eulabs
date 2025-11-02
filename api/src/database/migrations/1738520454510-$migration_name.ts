import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1738520454510 implements MigrationInterface {
    name = ' $migrationName1738520454510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus_stop" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bus_stop" ALTER COLUMN "description" SET NOT NULL`);
    }

}
