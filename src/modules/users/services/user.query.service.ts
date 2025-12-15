import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { UserMapper } from 'src/modules/users/application/mapping/user.mapper';
import { UserResponseDto } from '../application/dto/user-response.dto';

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
}
