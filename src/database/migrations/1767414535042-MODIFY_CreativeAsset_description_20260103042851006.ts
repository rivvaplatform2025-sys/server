import { MigrationInterface, QueryRunner } from "typeorm";

export class MODIFYCreativeAssetDescription202601030428510061767414535042 implements MigrationInterface {
    name = 'MODIFYCreativeAssetDescription202601030428510061767414535042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creative_assets" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creative_assets" DROP COLUMN "description"`);
    }

}
