import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1746403733027 implements MigrationInterface {
    name = ' $migrationName1746403733027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pricing_history_status_enum" AS ENUM('pending_approval', 'active', 'expired', 'inactive', 'scheduled')`);
        await queryRunner.query(`CREATE TABLE "pricing_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying, "lineId" uuid, "origin" character varying NOT NULL, "destiny" character varying NOT NULL, "timePurchase" character varying NOT NULL, "daysAdvance" character varying NOT NULL, "itineraries" jsonb NOT NULL, "frequencies" jsonb NOT NULL, "factors" jsonb NOT NULL, "salesFrequencies" jsonb NOT NULL, "optionalDetails" jsonb NOT NULL, "servicesEnd" jsonb NOT NULL, "status" "public"."pricing_history_status_enum" NOT NULL DEFAULT 'pending_approval', "activationDate" TIMESTAMP NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_07a306b951b2edd2dd01101aeb8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pricing_history" ADD CONSTRAINT "FK_9e32601ad5df0cc689aebf98fd2" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricing_history" DROP CONSTRAINT "FK_9e32601ad5df0cc689aebf98fd2"`);
        await queryRunner.query(`DROP TABLE "pricing_history"`);
        await queryRunner.query(`DROP TYPE "public"."pricing_history_status_enum"`);
    }

}
