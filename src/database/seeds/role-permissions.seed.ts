import { Permission } from 'src/modules/permissions/domain/entities/permission.entity';
import { RolePermission } from 'src/modules/role/domain/entities/role-permission.entity';
import { Role } from 'src/modules/role/domain/entities/role.entity';
import { DataSource } from 'typeorm';

export const rolePermissionsSeed = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const rolePermissionRepository = dataSource.getRepository(RolePermission);

  // Fetch roles and permissions
  const superAdmin = await roleRepository.findOneBy({ name: 'Super_Admin' });
  const allPermissions = await permissionRepository.find();

  if (superAdmin) {
    for (const perm of allPermissions) {
      const exists = await rolePermissionRepository.findOne({
        where: {
          role: { id: superAdmin.id },
          permission: { id: perm.id },
        },
      });
      if (!exists) {
        const rolePerm = new RolePermission();
        rolePerm.role = superAdmin;
        rolePerm.permission = perm;
        await rolePermissionRepository.save(rolePerm);
      }
    }
  }

  console.log('✅ Role-Permissions seeded successfully.');
};
