import { MigrationInterface, QueryRunner } from 'typeorm';

export class TABLEPlatform202512101524056301765380253671 implements MigrationInterface {
  name = 'TABLEPlatform202512101524056301765380253671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "platforms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "iconUrl" character varying, CONSTRAINT "UQ_6add27e349b6905c85e016fa2c4" UNIQUE ("name"), CONSTRAINT "PK_3b879853678f7368d46e52b81c6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "platforms"`);
  }
}
