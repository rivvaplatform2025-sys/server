// src/shared/dto/paginated.dto.ts
import { IsOptional, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', example: 1 })
  @IsOptional()
  @IsNumberString()
  page?: number | string;

  @ApiPropertyOptional({
    description: 'Items per page (max 100)',
    example: 25,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number | string;

  getPage(): number {
    const p = Number(this.page) || 1;
    return p > 0 ? p : 1;
  }

  getLimit(defaultLimit = 25, maxLimit = 100): number {
    const l = Number(this.limit);
    if (!Number.isInteger(l) || l <= 0) return defaultLimit;
    return Math.min(l, maxLimit);
  }

  // getLimit(defaultLimit = 25): number {
  //   const l = Number(this.limit) || defaultLimit;
  //   return l > 0 ? l : defaultLimit;
  // }
}
