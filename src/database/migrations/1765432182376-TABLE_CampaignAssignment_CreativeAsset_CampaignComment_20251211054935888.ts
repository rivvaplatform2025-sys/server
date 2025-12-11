import { MigrationInterface, QueryRunner } from "typeorm";

export class TABLECampaignAssignmentCreativeAssetCampaignComment202512110549358881765432182376 implements MigrationInterface {
    name = 'TABLECampaignAssignmentCreativeAssetCampaignComment202512110549358881765432182376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."campaign_assignments_role_enum" AS ENUM('creator', 'designer')`);
        await queryRunner.query(`CREATE TYPE "public"."campaign_assignments_status_enum" AS ENUM('pending', 'in_progress', 'submitted', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "campaign_assignments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."campaign_assignments_role_enum" NOT NULL DEFAULT 'creator', "status" "public"."campaign_assignments_status_enum" NOT NULL DEFAULT 'pending', "userId" uuid, "campaignId" uuid, CONSTRAINT "PK_c3af7d9cca6f9136d02a1a7c8ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."creative_assets_type_enum" AS ENUM('text', 'image', 'video', 'script', 'design')`);
        await queryRunner.query(`CREATE TABLE "creative_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "fileUrl" character varying, "content" text, "type" "public"."creative_assets_type_enum" NOT NULL DEFAULT 'image', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "campaignId" uuid, "createdById" uuid, CONSTRAINT "PK_e57a8ecd662436d7232513d87ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "campaign_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "campaignId" uuid, "userId" uuid, CONSTRAINT "PK_acf7bd8a95122ef6716b5c30bdc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "campaign_assignments" ADD CONSTRAINT "FK_e5d6c48377c67691bf6917e03fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign_assignments" ADD CONSTRAINT "FK_c4c4140a2fa8f631adc39e2af3c" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creative_assets" ADD CONSTRAINT "FK_371eebe1f7d437c64f412d32d67" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creative_assets" ADD CONSTRAINT "FK_5850f491246840005b08485babc" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign_comments" ADD CONSTRAINT "FK_95e404c9bb58cda7abfcd7e98b4" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign_comments" ADD CONSTRAINT "FK_2c6394897d885622a8c54606899" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign_comments" DROP CONSTRAINT "FK_2c6394897d885622a8c54606899"`);
        await queryRunner.query(`ALTER TABLE "campaign_comments" DROP CONSTRAINT "FK_95e404c9bb58cda7abfcd7e98b4"`);
        await queryRunner.query(`ALTER TABLE "creative_assets" DROP CONSTRAINT "FK_5850f491246840005b08485babc"`);
        await queryRunner.query(`ALTER TABLE "creative_assets" DROP CONSTRAINT "FK_371eebe1f7d437c64f412d32d67"`);
        await queryRunner.query(`ALTER TABLE "campaign_assignments" DROP CONSTRAINT "FK_c4c4140a2fa8f631adc39e2af3c"`);
        await queryRunner.query(`ALTER TABLE "campaign_assignments" DROP CONSTRAINT "FK_e5d6c48377c67691bf6917e03fb"`);
        await queryRunner.query(`DROP TABLE "campaign_comments"`);
        await queryRunner.query(`DROP TABLE "creative_assets"`);
        await queryRunner.query(`DROP TYPE "public"."creative_assets_type_enum"`);
        await queryRunner.query(`DROP TABLE "campaign_assignments"`);
        await queryRunner.query(`DROP TYPE "public"."campaign_assignments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."campaign_assignments_role_enum"`);
    }

}
