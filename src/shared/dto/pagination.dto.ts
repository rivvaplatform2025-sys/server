import { IsOptional, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumberString()
  page?: number | string;

  @ApiPropertyOptional({ description: 'Items per page', example: 25 })
  @IsOptional()
  @IsNumberString()
  limit?: number | string;

  getPage(): number {
    const p = Number(this.page) || 1;
    return p > 0 ? p : 1;
  }

  getLimit(defaultLimit = 25): number {
    const l = Number(this.limit) || defaultLimit;
    return l > 0 ? l : defaultLimit;
  }
}
