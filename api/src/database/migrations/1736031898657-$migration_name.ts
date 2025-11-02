import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1736031898657 implements MigrationInterface {
    name = ' $migrationName1736031898657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line" ADD "line_kmtotal" double precision`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "itinerary_kmtotal" double precision`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "lineId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD CONSTRAINT "FK_7e90ddf196fc2eadbf97fe83f92" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route_points" DROP CONSTRAINT "FK_7e90ddf196fc2eadbf97fe83f92"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "lineId"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "itinerary_kmtotal"`);
        await queryRunner.query(`ALTER TABLE "line" DROP COLUMN "line_kmtotal"`);
    }

}
