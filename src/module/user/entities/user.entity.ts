import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/abestract/base.entity.js';
import { EntityNames } from '../../../common/enums/entity.enum.js';

@Entity(EntityNames.UserEntity)
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  firstName: string;
  @Column({ type: 'varchar', length: 100 })
  lastName: string;
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  username: string;
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
