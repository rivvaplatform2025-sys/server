import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { UserMapper } from 'src/modules/users/application/mapping/user.mapper';
import { UserResponseDto } from '../application/dto/user-response.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';

@Injectable()
export class UserQueryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { organization: true, userRoles: { role: true } },
    });
    if (!user) throw new NotFoundException('User not found');

    return UserMapper.toResponse(user);
  }

  async getOrganizationUsers(orgId: string): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find({
      where: { organization: { id: orgId } },
      relations: { organization: true, userRoles: { role: true } },
    });
    if (!users || users.length === 0)
      throw new NotFoundException('User not found');

    return users.map((user) => UserMapper.toResponse(user));
  }

  async getUsersByRoleId(
    roleId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const page = pagination.getPage();
    const limit = pagination.getLimit();

    const qb = this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.userRoles', 'userRole')
      .innerJoin('userRole.role', 'role')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('role.id = :roleId', { roleId })
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [users, totalItems] = await qb.getManyAndCount();

    const items = users.map((user) => UserMapper.toResponse(user));
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        items,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      },
    };
  }
}
