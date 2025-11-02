import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1739714176718 implements MigrationInterface {
    name = ' $migrationName1739714176718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency" RENAME COLUMN "agency_type" TO "agency_typeId"`);
        await queryRunner.query(`CREATE TABLE "agency_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "agency_code" character varying NOT NULL, "agency_type" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_05ddd33182db219da28adc739d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "agency" DROP COLUMN "agency_typeId"`);
        await queryRunner.query(`ALTER TABLE "agency" ADD "agency_typeId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "agency" ADD CONSTRAINT "FK_b46665e21b5dbb63ae57cd4521e" FOREIGN KEY ("agency_typeId") REFERENCES "agency_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency" DROP CONSTRAINT "FK_b46665e21b5dbb63ae57cd4521e"`);
        await queryRunner.query(`ALTER TABLE "agency" DROP COLUMN "agency_typeId"`);
        await queryRunner.query(`ALTER TABLE "agency" ADD "agency_typeId" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "agency_type"`);
        await queryRunner.query(`ALTER TABLE "agency" RENAME COLUMN "agency_typeId" TO "agency_type"`);
    }

}
