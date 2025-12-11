import { MigrationInterface, QueryRunner } from 'typeorm';

export class TABLECampaign202512101723196771765387400161 implements MigrationInterface {
  name = 'TABLECampaign202512101723196771765387400161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."campaigns_status_enum" AS ENUM('draft', 'in_review', 'approved', 'running', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaigns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "status" "public"."campaigns_status_enum" NOT NULL DEFAULT 'draft', "startDate" date, "endDate" date, "budget" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "managerId" uuid, CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_57a4ef74334f28bab617ace14ae" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaigns" DROP CONSTRAINT "FK_57a4ef74334f28bab617ace14ae"`,
    );
    await queryRunner.query(`DROP TABLE "campaigns"`);
    await queryRunner.query(`DROP TYPE "public"."campaigns_status_enum"`);
  }
}
