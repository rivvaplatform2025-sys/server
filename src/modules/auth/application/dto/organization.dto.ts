import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationRequestDto {
  @ApiProperty({ example: 'ABCDE Limited' })
  @IsNotEmpty()
  @Length(6, 255)
  companyName: string;

  @ApiProperty({ example: 'abcde@name.com' })
  @IsOptional()
  @Length(2, 255)
  companyEmail?: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsOptional()
  @Length(7, 14)
  companyPhoneNumber?: string;

  @ApiProperty({
    example: '22, ABCDEF street allocation road, lagos, Nigeria.',
  })
  @IsOptional()
  @Length(2, 255)
  address?: string;

  @ApiProperty({ example: 'https://abcdeltd.com' })
  @IsOptional()
  companyWebsite?: string;
}

export class OrganizationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  UserEmail: string;

  @ApiProperty()
  createdAt: Date;
}
