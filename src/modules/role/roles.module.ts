import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/entities/role.entity';
import { RolePermission } from './domain/entities/role-permission.entity';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [TypeOrmModule],
})
export class RolesModule {}
