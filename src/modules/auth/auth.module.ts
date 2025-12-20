import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './domain/entities/refresh-token.entity';
import { User } from '../users/domain/entities/user.entity';
import { VerificationToken } from '../verification/domain/entities/verification-token.entity';
import { Role } from '../role/domain/entities/role.entity';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { RolePermission } from '../role/domain/entities/role-permission.entity';
import { UsersModule } from '../users/users.module';
import { VerificationTokenModule } from '../verification/verification-token.module';
import { RolesModule } from '../role/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { Organization } from '../organization/domain/entities/organization.entity';
import { OrganizationsModule } from '../organization/organizations.module';
import { Permission } from '../permissions/domain/entities/permission.entity';
import { UserRole } from '../users/domain/entities/user-role';
import { CommonModule } from 'src/common/common.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    VerificationTokenModule,
    RolesModule,
    PermissionsModule,
    OrganizationsModule,
    CommonModule,
    TypeOrmModule.forFeature([
      User,
      VerificationToken,
      Organization,
      RefreshToken,
      Role,
      UserRole,
      Permission,
      RolePermission,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN') ?? '15m',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
