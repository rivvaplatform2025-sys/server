import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationSchema202512051238137371764938294539 implements MigrationInterface {
    name = 'NotificationSchema202512051238137371764938294539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channel" character varying NOT NULL, "subject" character varying, "body" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "typeId" uuid, CONSTRAINT "PK_76f0fc48b8d057d2ae7f3a2848a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_58e4a26add3dbc104fc9265d5ae" UNIQUE ("key"), CONSTRAINT "PK_aa965e094494e2c4c5942cfb42d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification_templates" ADD CONSTRAINT "FK_1539f6dbc8ab7615804eaeca641" FOREIGN KEY ("typeId") REFERENCES "notification_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_templates" DROP CONSTRAINT "FK_1539f6dbc8ab7615804eaeca641"`);
        await queryRunner.query(`DROP TABLE "notification_types"`);
        await queryRunner.query(`DROP TABLE "notification_templates"`);
    }

}
