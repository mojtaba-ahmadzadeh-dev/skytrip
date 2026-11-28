import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';

export class AddPassengerDeletedAt1795861925473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.Passenger;

    const tableExists = await queryRunner.hasTable(tableName);

    if (!tableExists) return;

    const columnExists = await queryRunner.hasColumn(tableName, 'deleted_at');

    if (columnExists) return;

    await queryRunner.addColumn(
      tableName,
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.Passenger;

    const tableExists = await queryRunner.hasTable(tableName);

    if (!tableExists) return;

    const columnExists = await queryRunner.hasColumn(tableName, 'deleted_at');

    if (!columnExists) return;

    await queryRunner.dropColumn(tableName, 'deleted_at');
  }
}
