import { Column, DeleteDateColumn, Entity, Index } from 'typeorm';

import { BaseEntity } from '../../../common/abestract/base.entity.js';
import { EntityNames } from '../../../common/enums/entity.enum.js';

@Entity(EntityNames.City)
@Index('UQ_city_name_province', ['name', 'province'], {
  unique: true,
})
export class City extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'varchar', length: 100 })
  province: string;
  @Column({ type: 'varchar', length: 100 })
  country: string;
  @Column({ type: 'varchar', length: 2 })
  countryCode: string;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
