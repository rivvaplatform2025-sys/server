import { Role } from 'src/modules/role/domain/entities/role.entity';
import { DataSource } from 'typeorm';

export const roleSeed = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    { name: 'Super_Admin', description: 'Has all permissions' },
    { name: 'Admin', description: 'Manages campaigns and users' },
    { name: 'Creator', description: 'Creates campaign content' },
    { name: 'Designer', description: 'Designs campaign visuals' },
  ];

  for (const role of roles) {
    const exists = await roleRepository.findOne({ where: { name: role.name } });
    if (!exists) {
      await roleRepository.save(role);
    }
  }
  console.log('✅ Roles seeded successfully.');
};
