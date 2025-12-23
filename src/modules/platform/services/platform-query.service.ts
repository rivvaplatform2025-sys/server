import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from '../domain/entities/platform.entity';
import { Repository } from 'typeorm';
import { PlatformResponseDto } from '../application/dto/platform-response.dto';
import { PlatformMapper } from '../application/mapper/platform.mapper';

@Injectable()
export class PlatformQueryService {
  constructor(
    @InjectRepository(Platform)
    private readonly platformRepo: Repository<Platform>,
  ) {}

  async getAll(): Promise<PlatformResponseDto[]> {
    let response: PlatformResponseDto[] | null = null;
    const platforms = await this.platformRepo.find();
    if (!platforms) throw new NotFoundException('No Role record found.');

    response = platforms.map((role) => ({
      id: role.id,
      name: role.name,
    }));

    return response;
  }

  async getById(platformId: string): Promise<PlatformResponseDto> {
    const platform = await this.platformRepo.findOne({
      where: { id: platformId },
    });
    if (!platform) throw new NotFoundException('User not found');

    return PlatformMapper.toResponse(platform);
  }
}
