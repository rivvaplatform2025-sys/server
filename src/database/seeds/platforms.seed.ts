import { Platform } from 'src/modules/platform/domain/entities/platform.entity';
import { DataSource } from 'typeorm';

export const platformSeed = async (dataSource: DataSource) => {
  const platformRepository = dataSource.getRepository(Platform);

  const platforms = [
    { name: 'Instagram' },
    { name: 'Tiktok' },
    { name: 'X' },
    { name: 'Youtube' },
  ];

  for (const pl of platforms) {
    const exists = await platformRepository.findOne({
      where: { name: pl.name },
    });
    if (!exists) {
      await platformRepository.save(pl);
    }
  }
  console.log('✅ Platforms seeded successfully.');
};
