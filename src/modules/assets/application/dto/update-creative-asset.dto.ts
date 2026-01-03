import { IsOptional, IsString } from 'class-validator';

export class UpdateCreativeAssetDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
