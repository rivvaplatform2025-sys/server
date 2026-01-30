import { MigrationInterface, QueryRunner } from 'typeorm';

export class MODIFYCreativeAssetStatusInReview202601300630171221769754618628 implements MigrationInterface {
  name = 'MODIFYCreativeAssetStatusInReview202601300630171221769754618628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."creative_assets_status_enum" RENAME TO "creative_assets_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."creative_assets_status_enum" AS ENUM('draft', 'submitted', 'inReview', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "creative_assets" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "creative_assets" ALTER COLUMN "status" TYPE "public"."creative_assets_status_enum" USING "status"::"text"::"public"."creative_assets_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creative_assets" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."creative_assets_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."creative_assets_status_enum_old" AS ENUM('draft', 'submitted', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "creative_assets" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "creative_assets" ALTER COLUMN "status" TYPE "public"."creative_assets_status_enum_old" USING "status"::"text"::"public"."creative_assets_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creative_assets" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(`DROP TYPE "public"."creative_assets_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."creative_assets_status_enum_old" RENAME TO "creative_assets_status_enum"`,
    );
  }
}
