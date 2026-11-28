import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';

export class $npmConfigName1795885702833 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.City;

    const hasColumn = await queryRunner.hasColumn(tableName, 'deleted_at');

    if (!hasColumn) {
      await queryRunner.addColumn(
        tableName,
        new TableColumn({
          name: 'deleted_at',
          type: 'timestamp',
          isNullable: true,
          default: null,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.City;

    const hasColumn = await queryRunner.hasColumn(tableName, 'deleted_at');

    if (hasColumn) {
      await queryRunner.dropColumn(tableName, 'deleted_at');
    }
  }
}
