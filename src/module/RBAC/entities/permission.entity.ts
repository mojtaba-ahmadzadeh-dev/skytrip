import { Entity, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EntityNames } from '../../../common/enums/entity.enum.js';
import { RoleEntity } from './role.entity.js';
import { BaseEntity } from '../../../common/abestract/base.entity.js';


@Entity(EntityNames.Permissions)
export class PermissionEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;
  @Column({
    nullable: true,
    default: '',
  })
  description?: string;
  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
