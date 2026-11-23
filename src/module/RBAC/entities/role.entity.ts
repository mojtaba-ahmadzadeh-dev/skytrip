import {
  Entity,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { EntityNames } from '../../../common/enums/entity.enum.js';
import { PermissionEntity } from './permission.entity.js';
import { BaseEntity } from '../../../common/abestract/base.entity.js';

@Entity(EntityNames.Roles)
export class RoleEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;
  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permissions: PermissionEntity[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
