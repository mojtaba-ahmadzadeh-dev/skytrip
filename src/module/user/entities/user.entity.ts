import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/abestract/base.entity.js';
import { EntityNames } from '../../../common/enums/entity.enum.js';
import { OtpEntity } from '../entities/otp.entity.js';
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

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  otp: Relation<OtpEntity>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}