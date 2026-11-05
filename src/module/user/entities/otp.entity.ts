import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
}  from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../user/entities/user.entity.js';

@Entity('otp')
export class OtpEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'timestamptz' })
  expiresIn: Date;

  @Column({ type: 'integer', unique: true })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  method: string | null;

  @OneToOne(() => User, (user) => user.otp, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;
}