import { MigrationInterface, QueryRunner } from "typeorm";

export class TABLENewslettersubscriber202512091216496311765282610317 implements MigrationInterface {
    name = 'TABLENewslettersubscriber202512091216496311765282610317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "newsletter-subscriber" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "isVerified" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_763b8cbcf87c98694f847b7e9cb" UNIQUE ("email"), CONSTRAINT "PK_6b79a1fdc2443678118fc13eda5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "newsletter-subscriber"`);
    }

}
