
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { EntityNames } from '../common/enums/entity.enum.js';

export class CreateOtp1793889000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('otp'))) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.OtpEntity,
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
        'otp',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('otp')) {
      await queryRunner.dropTable('otp', true);
    }
  }
}
