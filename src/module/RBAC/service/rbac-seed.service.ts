import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity.js';
import { PermissionEntity } from '../entities/permission.entity.js';
import { Roles } from '../../../common/enums/role.enum.js';


@Injectable()
export class RbacSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedRoles();
  }

  private async seedRoles(): Promise<void> {
    const roles = [
      Roles.SUPER_ADMIN,
      Roles.ADMIN,
      Roles.SUPPORT,
      Roles.USER,
    ];

    // Create roles if they do not exist
    for (const name of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name },
      });

      if (!existingRole) {
        await this.roleRepository.save(
          this.roleRepository.create({ name }),
        );
      }
    }

    // Create the full-access permission
    let allPermission = await this.permissionRepository.findOne({
      where: { name: 'all' },
    });

    if (!allPermission) {
      allPermission = await this.permissionRepository.save(
        this.permissionRepository.create({
          name: 'all',
          description: 'Full system access',
        }),
      );
    }

    // Assign "all" permission to super_admin
    const superAdminRole = await this.roleRepository.findOne({
      where: { name: Roles.SUPER_ADMIN },
      relations: {
        permissions: true,
      },
    });

    if (superAdminRole) {
      const alreadyAssigned = superAdminRole.permissions.some(
        (permission) => permission.id === allPermission.id,
      );

      if (!alreadyAssigned) {
        superAdminRole.permissions.push(allPermission);
        await this.roleRepository.save(superAdminRole);
      }
    }
  }
}