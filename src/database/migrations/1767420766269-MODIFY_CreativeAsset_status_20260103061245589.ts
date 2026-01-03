import { MigrationInterface, QueryRunner } from 'typeorm';

export class MODIFYCreativeAssetStatus202601030612455891767420766269 implements MigrationInterface {
  name = 'MODIFYCreativeAssetStatus202601030612455891767420766269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."creative_assets_status_enum" AS ENUM('draft', 'submitted', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "creative_assets" ADD "status" "public"."creative_assets_status_enum" NOT NULL DEFAULT 'draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creative_assets" DROP COLUMN "status"`,
    );
    await queryRunner.query(`DROP TYPE "public"."creative_assets_status_enum"`);
  }
}
