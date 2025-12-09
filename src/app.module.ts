import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './config/database/database.config';
import { createTypeOrmConfig } from './config/database';
import { Role } from './modules/role/domain/entities/role.entity';
import { RolePermission } from './modules/role/domain/entities/role-permission.entity';
import { User } from './modules/users/domain/entities/user.entity';
import { VerificationToken } from './modules/verification/domain/entities/verification-token.entity';
import { RefreshToken } from './modules/auth/domain/entities/refresh-token.entity';
import { Organization } from './modules/organization/domain/entities/organization.entity';
import { Permission } from './modules/permissions/domain/entities/permission.entity';
import { UserRole } from './modules/users/domain/entities/user-role';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const baseConfig = createTypeOrmConfig(config);

        return {
          ...baseConfig,
          synchronize: false,
          autoLoadEntities: false,

          entities: [
            User,
            VerificationToken,
            RefreshToken,
            Organization,
            Role,
            Permission,
            RolePermission,
            UserRole,
          ],

          extra: {
            max: 5,
            connectionTimeoutMillis: 5000,
          },
        };
      },
    }),
    AuthModule,
  ],
  // providers: [AuthService, JwtStrategy],
  // controllers: [AuthController],
  // exports: [AuthService],
})
export class AppModule {}
