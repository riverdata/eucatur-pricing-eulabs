import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1738522716870 implements MigrationInterface {
    name = ' $migrationName1738522716870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route_points" DROP CONSTRAINT "FK_c9e049ff69acaa01eb08abbaa39"`);
        await queryRunner.query(`CREATE TABLE "price_route_points" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "route_km" double precision NOT NULL DEFAULT '0', "amount" double precision NOT NULL DEFAULT '0', "routePointId" uuid NOT NULL, "categoryId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_92718c2a63a043bb8185c8677d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "route_points" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "price_route_points" ADD CONSTRAINT "FK_dfe6c8f4743ca97ef88134a7091" FOREIGN KEY ("routePointId") REFERENCES "route_points"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price_route_points" ADD CONSTRAINT "FK_d589c7be58fc517265d8ad4463d" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price_route_points" DROP CONSTRAINT "FK_d589c7be58fc517265d8ad4463d"`);
        await queryRunner.query(`ALTER TABLE "price_route_points" DROP CONSTRAINT "FK_dfe6c8f4743ca97ef88134a7091"`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "categoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD "amount" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "price_route_points"`);
        await queryRunner.query(`ALTER TABLE "route_points" ADD CONSTRAINT "FK_c9e049ff69acaa01eb08abbaa39" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
