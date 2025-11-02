import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1739125433946 implements MigrationInterface {
    name = ' $migrationName1739125433946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "agency_id" integer NOT NULL, "agency_code" character varying NOT NULL, "agency_description" character varying NOT NULL, "agency_boarding_disembarking" character varying NOT NULL, "agency_type" character varying NOT NULL, "agency_status" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ab1244724d1c216e9720635a2e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "description"`);
        await queryRunner.query(`DROP TABLE "agency"`);
    }

}
