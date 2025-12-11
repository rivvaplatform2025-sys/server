import { MigrationInterface, QueryRunner } from 'typeorm';

export class MODIFYOrganization202512111311012111765458665530 implements MigrationInterface {
  name = 'MODIFYOrganization202512111311012111765458665530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "email" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "phoneNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "website" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_434e91eb969ecc257d9aac0a3cf" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaigns" DROP CONSTRAINT "FK_434e91eb969ecc257d9aac0a3cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "website"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "phoneNumber"`,
    );
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "campaigns" DROP COLUMN "organizationId"`,
    );
  }
}
