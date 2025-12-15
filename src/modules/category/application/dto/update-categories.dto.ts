import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray } from 'class-validator';

export class UpdateUserCategoriesDto {
  @ApiProperty()
  @IsArray()
  @IsUUID('all', { each: true })
  categoryIds: string[];
}
