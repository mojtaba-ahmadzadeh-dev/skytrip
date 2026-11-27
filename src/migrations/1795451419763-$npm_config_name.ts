import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

import { EntityNames } from '../common/enums/entity.enum.js';

export class AddTargetEmailToOtp1793900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.OtpEntity;

    if (!(await queryRunner.hasTable(tableName))) {
      throw new Error(`Table ${tableName} does not exist`);
    }

    if (await queryRunner.hasColumn(tableName, 'targetEmail')) {
      return;
    }

    await queryRunner.addColumn(
      tableName,
      new TableColumn({
        name: 'targetEmail',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableName = EntityNames.OtpEntity;

    if (
      (await queryRunner.hasTable(tableName)) &&
      (await queryRunner.hasColumn(tableName, 'targetEmail'))
    ) {
      await queryRunner.dropColumn(tableName, 'targetEmail');
    }
  }
}
