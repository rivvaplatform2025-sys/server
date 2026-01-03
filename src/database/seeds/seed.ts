import dataSource from 'typeorm.config';
// import { roleSeed } from './roles.seed';
// import { permissionSeed } from './permissions.seed';
// import { rolePermissionsSeed } from './role-permissions.seed';
import { getErrorMessage } from 'src/common/utils/error.util';
import { notificationsSeed } from './notifications.seed';
//import { platformSeed } from './platforms.seed';
//import { categoryTypeSeed } from './category-type.seed';

const runSeeds = async () => {
  try {
    await dataSource.initialize();
    console.log('🟢 Database connected. Running seeds...');

    // await roleSeed(dataSource);
    // await permissionSeed(dataSource);
    // await rolePermissionsSeed(dataSource);
    await notificationsSeed(dataSource);
    // await platformSeed(dataSource);
    // await categoryTypeSeed(dataSource);

    console.log('🎉 All seeds completed successfully!');
    await dataSource.destroy();
  } catch (err) {
    const message = getErrorMessage(err);
    console.log('🟢 Catched Error Running seeds...', message);
    await dataSource.destroy();
    process.exit(1);
  }
};
runSeeds();
