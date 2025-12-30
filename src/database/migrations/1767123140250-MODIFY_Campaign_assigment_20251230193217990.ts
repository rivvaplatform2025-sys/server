import { MigrationInterface, QueryRunner } from 'typeorm';

export class MODIFYCampaignAssigment202512301932179901767123140250 implements MigrationInterface {
  name = 'MODIFYCampaignAssigment202512301932179901767123140250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" DROP CONSTRAINT "FK_e5d6c48377c67691bf6917e03fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" DROP CONSTRAINT "FK_c4c4140a2fa8f631adc39e2af3c"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."campaign_assignments_status_enum" RENAME TO "campaign_assignments_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campaign_assignments_status_enum" AS ENUM('pending', 'accepted', 'in_progress', 'submitted', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ALTER COLUMN "status" TYPE "public"."campaign_assignments_status_enum" USING "status"::"text"::"public"."campaign_assignments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campaign_assignments_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ADD CONSTRAINT "FK_e5d6c48377c67691bf6917e03fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ADD CONSTRAINT "FK_c4c4140a2fa8f631adc39e2af3c" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" DROP CONSTRAINT "FK_c4c4140a2fa8f631adc39e2af3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" DROP CONSTRAINT "FK_e5d6c48377c67691bf6917e03fb"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campaign_assignments_status_enum_old" AS ENUM('pending', 'in_progress', 'submitted', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ALTER COLUMN "status" TYPE "public"."campaign_assignments_status_enum_old" USING "status"::"text"::"public"."campaign_assignments_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."campaign_assignments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."campaign_assignments_status_enum_old" RENAME TO "campaign_assignments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ADD CONSTRAINT "FK_c4c4140a2fa8f631adc39e2af3c" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_assignments" ADD CONSTRAINT "FK_e5d6c48377c67691bf6917e03fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
