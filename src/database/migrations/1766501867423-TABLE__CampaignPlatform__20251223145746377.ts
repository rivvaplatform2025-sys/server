import { MigrationInterface, QueryRunner } from 'typeorm';

export class TABLE_CampaignPlatform_202512231457463771766501867423 implements MigrationInterface {
  name = 'TABLE_CampaignPlatform_202512231457463771766501867423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "campaign_platforms" ("campaign_id" uuid NOT NULL, "platform_id" uuid NOT NULL, CONSTRAINT "PK_5b5d472b24c1919b8c45fb6ce7f" PRIMARY KEY ("campaign_id", "platform_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cb4a78f3e02924354024e33b13" ON "campaign_platforms" ("campaign_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0ba4239d42d9667b933f6ab62" ON "campaign_platforms" ("platform_id") `,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_invitations_status_enum" RENAME TO "organization_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."organization_invitations_status_enum" AS ENUM('pending', 'accepted', 'expired', 'revoked')`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "status" TYPE "public"."organization_invitations_status_enum" USING "status"::"text"::"public"."organization_invitations_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."organization_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_platforms" ADD CONSTRAINT "FK_cb4a78f3e02924354024e33b13f" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_platforms" ADD CONSTRAINT "FK_d0ba4239d42d9667b933f6ab620" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaign_platforms" DROP CONSTRAINT "FK_d0ba4239d42d9667b933f6ab620"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_platforms" DROP CONSTRAINT "FK_cb4a78f3e02924354024e33b13f"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."organization_invitations_status_enum_old" AS ENUM('pending', 'accepted', 'expired')`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "status" TYPE "public"."organization_invitations_status_enum_old" USING "status"::"text"::"public"."organization_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."organization_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_invitations_status_enum_old" RENAME TO "organization_invitations_status_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d0ba4239d42d9667b933f6ab62"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cb4a78f3e02924354024e33b13"`,
    );
    await queryRunner.query(`DROP TABLE "campaign_platforms"`);
  }
}
