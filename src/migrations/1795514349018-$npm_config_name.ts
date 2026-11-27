import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';

export class RemoveUserBanFields1795522000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.UserEntity;

    if (!(await queryRunner.hasTable(tableName))) {
      throw new Error(`Table ${tableName} does not exist`);
    }

    const table = await queryRunner.getTable(tableName);

    if (!table) {
      throw new Error(`Unable to load table ${tableName}`);
    }

    const columnsToRemove = ['banReason', 'bannedAt'];

    for (const columnName of columnsToRemove) {
      if (table.findColumnByName(columnName)) {
        await queryRunner.dropColumn(tableName, columnName);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.UserEntity;

    await queryRunner.addColumns(tableName, [
      new TableColumn({
        name: 'banReason',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
      new TableColumn({
        name: 'bannedAt',
        type: 'timestamptz',
        isNullable: true,
      }),
    ]);
  }
}