import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { UpdateProfileRequestDto } from '../application/dto/update-profile.dto';
import { UserResponseDto } from '../application/dto/user-response.dto';
import { UserMapper } from 'src/modules/users/application/mapping/user.mapper';

@Injectable()
export class UserCommandService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateProfileRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { organization: true, userRoles: { role: true } },
    });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);

    const savedUser = await this.userRepo.save(user);

    return UserMapper.toResponse(savedUser);
  }

  async updateLastLogin(userId: string): Promise<UserResponseDto> {
    await this.userRepo.update(userId, {
      lastLoginAt: new Date(),
    });

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        organization: true,
        userRoles: {
          role: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toResponse(user);
  }
}
