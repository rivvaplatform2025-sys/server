import { Permission } from 'src/modules/permissions/domain/entities/permission.entity';
import { DataSource } from 'typeorm';

export const permissionSeed = async (dataSource: DataSource) => {
  const permissionRepository = dataSource.getRepository(Permission);

  const permissions = [
    { name: 'CREATE_CAMPAIGN', description: 'Can create campaigns' },
    { name: 'EDIT_CAMPAIGN', description: 'Can edit campaigns' },
    { name: 'DELETE_CAMPAIGN', description: 'Can delete campaigns' },
    { name: 'VIEW_CAMPAIGN', description: 'Can view campaigns' },
    { name: 'MANAGE_USERS', description: 'Can manage users' },
  ];
  for (const permission of permissions) {
    const exists = await permissionRepository.findOne({
      where: { name: permission.name },
    });
    if (!exists) {
      await permissionRepository.save(permission);
    }
  }

  console.log('✅ Permissions seeded successfully.');
};
