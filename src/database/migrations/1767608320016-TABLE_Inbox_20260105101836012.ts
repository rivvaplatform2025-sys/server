import { MigrationInterface, QueryRunner } from 'typeorm';

export class TABLEInbox202601051018360121767608320016 implements MigrationInterface {
  name = 'TABLEInbox202601051018360121767608320016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."conversation_participants_role_enum" AS ENUM('brand_manager', 'designer', 'creator')`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."conversation_participants_role_enum" NOT NULL, "lastReadMessageId" uuid, "isMuted" boolean NOT NULL DEFAULT false, "isArchived" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "leftAt" TIMESTAMP WITH TIME ZONE, "conversationId" uuid, "userId" uuid, CONSTRAINT "UQ_e43efbfa3b850160b5b2c50e3ec" UNIQUE ("conversationId", "userId"), CONSTRAINT "PK_61b51428ad9453f5921369fbe94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_cp_user_conv" ON "conversation_participants" ("userId", "conversationId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."messages_type_enum" AS ENUM('TEXT', 'IMAGE', 'FILE', 'SYSTEM')`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."messages_type_enum" NOT NULL DEFAULT 'TEXT', "content" text, "attachments" jsonb, "isEdited" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "conversationId" uuid, "senderId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_msg_conv_created" ON "messages" ("conversationId", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."conversations_type_enum" AS ENUM('DM', 'GROUP', 'CAMPAIGN')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."conversations_status_enum" AS ENUM('ACTIVE', 'ARCHIVED', 'CLOSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "type" "public"."conversations_type_enum" NOT NULL DEFAULT 'DM', "status" "public"."conversations_status_enum" NOT NULL DEFAULT 'ACTIVE', "lastMessageId" uuid, "lastMessageAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "organizationId" uuid NOT NULL, "campaignId" uuid, "createdById" uuid, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conv_org_last_msg" ON "conversations" ("organizationId", "lastMessageAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_4453e20858b14ab765a09ad728c" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_18c4ba3b127461649e5f5039dbf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_dd02b2c7cad0901abc74f7ac713" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_83e0cf8d62e0e0cb8824d3b1df3" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_73e0dec6b5702510402d210b3ac" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_73e0dec6b5702510402d210b3ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_83e0cf8d62e0e0cb8824d3b1df3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_dd02b2c7cad0901abc74f7ac713"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_18c4ba3b127461649e5f5039dbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_4453e20858b14ab765a09ad728c"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_conv_org_last_msg"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TYPE "public"."conversations_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."conversations_type_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_msg_conv_created"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TYPE "public"."messages_type_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_cp_user_conv"`);
    await queryRunner.query(`DROP TABLE "conversation_participants"`);
    await queryRunner.query(
      `DROP TYPE "public"."conversation_participants_role_enum"`,
    );
  }
}
