import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { RoleResponseDto } from '../application/dto/role-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('Role')
@Controller({ path: 'role', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiOperation({ summary: 'Retrieve all the role in the storage' })
  async getAll(): Promise<RoleResponseDto[]> {
    return await this.roleService.getAll();
  }

  @Get('application')
  @ApiOperation({
    summary: 'Retrieve only roles required for the clent system',
  })
  async getApplication(): Promise<RoleResponseDto[]> {
    return await this.roleService.getApplication();
  }
}
