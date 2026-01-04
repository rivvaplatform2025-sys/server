import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber, IsUrl } from 'class-validator';

export class UpdateProfileRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
