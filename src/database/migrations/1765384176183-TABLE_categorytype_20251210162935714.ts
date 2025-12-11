import { MigrationInterface, QueryRunner } from 'typeorm';

export class TABLECategorytype202512101629357141765384176183 implements MigrationInterface {
  name = 'TABLECategorytype202512101629357141765384176183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_70d68ee100bb24b690432660da4" UNIQUE ("name"), CONSTRAINT "PK_9059b70ea6d2dd623ed25250d5a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_categorytypes" ("user_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_4083c250a793b2684103d1dac51" PRIMARY KEY ("user_id", "category_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1914b3e7af7a529439da1ee91c" ON "user_categorytypes" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0dd08e084f86c5a65626aaea09" ON "user_categorytypes" ("category_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categorytypes" ADD CONSTRAINT "FK_1914b3e7af7a529439da1ee91cf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categorytypes" ADD CONSTRAINT "FK_0dd08e084f86c5a65626aaea09e" FOREIGN KEY ("category_id") REFERENCES "category_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_categorytypes" DROP CONSTRAINT "FK_0dd08e084f86c5a65626aaea09e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categorytypes" DROP CONSTRAINT "FK_1914b3e7af7a529439da1ee91cf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0dd08e084f86c5a65626aaea09"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1914b3e7af7a529439da1ee91c"`,
    );
    await queryRunner.query(`DROP TABLE "user_categorytypes"`);
    await queryRunner.query(`DROP TABLE "category_types"`);
  }
}
