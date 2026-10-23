import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { EntityNames } from '../common/enums/entity.enum.js';

export class CreateUsers1792757812749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.UserEntity;

    // ========================
    // USERS TABLE
    // ========================
    if (!(await queryRunner.hasTable(tableName))) {
      await queryRunner.createTable(
        new Table({
          name: tableName,
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'firstName',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'lastName',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'phoneNumber',
              type: 'varchar',
              length: '20',
              isUnique: true,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isUnique: true,
            },
            {
              name: 'username',
              type: 'varchar',
              length: '50',
              isUnique: true,
            },
            {
              name: 'password',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'createdAt',
              type: 'timestamptz',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamptz',
              default: 'now()',
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.UserEntity;

    if (await queryRunner.hasTable(tableName)) {
      await queryRunner.dropTable(tableName, true);
    }
  }
}
