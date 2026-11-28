import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';

export class CreateCity1795863901620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.City;

    const tableExists = await queryRunner.hasTable(tableName);

    if (tableExists) return;

    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'province',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'countryCode',
            type: 'varchar',
            length: '2',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      tableName,
      new TableIndex({
        name: 'UQ_city_name_province',
        columnNames: ['name', 'province'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.City;

    const tableExists = await queryRunner.hasTable(tableName);

    if (!tableExists) return;

    await queryRunner.dropTable(tableName);
  }
}
