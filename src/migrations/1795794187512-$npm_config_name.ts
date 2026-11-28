import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';
import { PassengerGender } from '../module/passenger/enum/passenger.enum.js';

export class CreatePassenger1795794187512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.Passenger;

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
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'birthDate',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: Object.values(PassengerGender),
            isNullable: false,
          },
          {
            name: 'nationalCode',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'passportNumber',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'nationality',
            type: 'varchar',
            length: '100',
            isNullable: true,
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
    );

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        name: 'FK_passenger_user',
        columnNames: ['user_id'],
        referencedTableName: EntityNames.UserEntity,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.Passenger;

    if (!(await queryRunner.hasTable(tableName))) return;

    await queryRunner.dropTable(tableName, true);
  }
}
