
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';

export class CreateOtp1793889000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.OtpEntity;

    if (await queryRunner.hasTable(tableName)) return;

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
            name: 'code',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'expiresIn',
            type: 'timestamptz',
          },
          {
            name: 'userId',
            type: 'integer',
            isUnique: true,
          },
          {
            name: 'method',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        name: 'FK_otp_user',
        columnNames: ['userId'],
        referencedTableName: EntityNames.UserEntity,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.OtpEntity;

    if (await queryRunner.hasTable(tableName)) {
      await queryRunner.dropTable(tableName, true);
    }
  }
}
