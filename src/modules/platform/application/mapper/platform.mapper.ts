import { Platform } from '../../domain/entities/platform.entity';
import { PlatformResponseDto } from '../dto/platform-response.dto';

export class PlatformMapper {
  static toResponse(platform: Platform): PlatformResponseDto {
    return {
      id: platform.id,
      name: platform.name,
    };
  }
}
