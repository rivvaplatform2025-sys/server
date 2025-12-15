import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../domain/entities/role.entity';
import { RoleResponseDto } from '../application/dto/role-response.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async getAll(): Promise<RoleResponseDto[]> {
    let response: RoleResponseDto[] | null = null;
    const roles = await this.roleRepo.find();
    if (!roles) throw new NotFoundException('No Role record found.');

    response = roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));

    return response;
  }
  async getApplication(): Promise<RoleResponseDto[]> {
    let response: RoleResponseDto[] | null = null;
    const allowedRoles = ['Designer', 'Creator', 'Brand Manager'];

    response = await this.roleRepo.find({
      select: ['id', 'name'],
      where: {
        name: In(allowedRoles),
      },
      order: { name: 'ASC' },
    });
    if (!response) throw new NotFoundException('No Role record found.');

    return response;
  }
}
