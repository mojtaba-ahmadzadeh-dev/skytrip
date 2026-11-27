
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';

export class AddUserBanFields1795520000000
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

    // Add isBanned column if it does not exist.
    if (!table.findColumnByName('isBanned')) {
      await queryRunner.addColumn(
        tableName,
        new TableColumn({
          name: 'isBanned',
          type: 'boolean',
          default: false,
          isNullable: false,
        }),
      );
    }

    // Add banReason column if it does not exist.
    if (!table.findColumnByName('banReason')) {
      await queryRunner.addColumn(
        tableName,
        new TableColumn({
          name: 'banReason',
          type: 'varchar',
          length: '500',
          isNullable: true,
        }),
      );
    }

    // Add bannedAt column if it does not exist.
    if (!table.findColumnByName('bannedAt')) {
      await queryRunner.addColumn(
        tableName,
        new TableColumn({
          name: 'bannedAt',
          type: 'timestamptz',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.UserEntity;

    if (!(await queryRunner.hasTable(tableName))) {
      return;
    }

    const table = await queryRunner.getTable(tableName);

    if (!table) return;

    // Remove only the columns added by this migration.
    const columns = ['bannedAt', 'banReason', 'isBanned'];

    for (const columnName of columns) {
      if (table.findColumnByName(columnName)) {
        await queryRunner.dropColumn(tableName, columnName);
      }
    }
  }
}
