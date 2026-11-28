import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { EntityNames } from '../../../common/enums/entity.enum.js';
import { User } from '../../user/entities/user.entity.js';
import { PassengerGender } from '../enum/passenger.enum.js';
import { BaseEntity } from '../../../common/abestract/base.entity.js';

@Entity(EntityNames.Passenger)
export class Passenger extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
  @Column({ type: 'varchar', length: 100 })
  firstName: string;
  @Column({ type: 'varchar', length: 100 })
  lastName: string;
  @Column({ type: 'date' })
  birthDate: Date;
  @Column({
    type: 'enum',
    enum: PassengerGender,
    enumName: 'passenger_gender_enum',
  })
  gender: PassengerGender;
  @Column({ type: 'varchar', length: 30 })
  nationalCode: string;
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
  @Column({ type: 'varchar', length: 50, nullable: true })
  passportNumber: string | null;
  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string | null;
}
