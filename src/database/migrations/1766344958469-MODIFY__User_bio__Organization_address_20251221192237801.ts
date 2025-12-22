import { MigrationInterface, QueryRunner } from 'typeorm';

export class MODIFY_UserBio_OrganizationAddress202512211922378011766344958469 implements MigrationInterface {
  name = 'MODIFY_UserBio_OrganizationAddress202512211922378011766344958469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "address" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "address"`,
    );
  }
}
