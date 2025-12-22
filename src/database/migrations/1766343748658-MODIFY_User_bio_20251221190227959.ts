import { MigrationInterface, QueryRunner } from 'typeorm';

export class MODIFYUserBio202512211902279591766343748658 implements MigrationInterface {
  name = 'MODIFYUserBio202512211902279591766343748658';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."campaigns_status_enum" RENAME TO "campaigns_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campaigns_status_enum" AS ENUM('draft', 'in_review', 'approved', 'running', 'completed', 'archived')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ALTER COLUMN "status" TYPE "public"."campaigns_status_enum" USING "status"::"text"::"public"."campaigns_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(`DROP TYPE "public"."campaigns_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."campaigns_status_enum_old" AS ENUM('draft', 'in_review', 'approved', 'running', 'completed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ALTER COLUMN "status" TYPE "public"."campaigns_status_enum_old" USING "status"::"text"::"public"."campaigns_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(`DROP TYPE "public"."campaigns_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."campaigns_status_enum_old" RENAME TO "campaigns_status_enum"`,
    );
  }
}
