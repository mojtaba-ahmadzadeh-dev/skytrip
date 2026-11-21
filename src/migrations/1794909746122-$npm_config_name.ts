
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';

export class CreateRolePermissions1792000000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = 'role_permissions';

    if (await queryRunner.hasTable(tableName)) return;

    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'roleId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'permissionId',
            type: 'integer',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys(tableName, [
      new TableForeignKey({
        name: 'FK_role_permissions_role',
        columnNames: ['roleId'],
        referencedTableName: EntityNames.Roles,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_role_permissions_permission',
        columnNames: ['permissionId'],
        referencedTableName: EntityNames.Permissions,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = 'role_permissions';

    if (await queryRunner.hasTable(tableName)) {
      await queryRunner.dropTable(tableName, true);
    }
  }
}
