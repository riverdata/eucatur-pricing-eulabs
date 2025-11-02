import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1746383503881 implements MigrationInterface {
    name = ' $migrationName1746383503881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "managerId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "factor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "factor_code" character varying NOT NULL, "factor_description" character varying NOT NULL, "factor_weight" integer NOT NULL, "factor_weight_add" jsonb NOT NULL DEFAULT '[]', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_bd58c9ca8df6ccead82b332e936" UNIQUE ("description"), CONSTRAINT "UQ_4c89dfc001297d694408945953f" UNIQUE ("factor_description"), CONSTRAINT "PK_474c0e9d4ca1c181f178952187d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "departmentId" uuid`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_2147eb9946aa96094b7f78b1954" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "price_route_points"`);
        await queryRunner.query(`DROP TABLE "route_points"`);
        await queryRunner.query(`DROP TABLE "bus_stop"`);
        await queryRunner.query(`DROP TABLE "service"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_2147eb9946aa96094b7f78b1954"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "departmentId"`);
        await queryRunner.query(`DROP TABLE "factor"`);
        await queryRunner.query(`DROP TABLE "department"`);
    }

}
