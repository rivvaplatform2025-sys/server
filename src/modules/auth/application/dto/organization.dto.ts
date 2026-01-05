import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationRequestDto {
  // @ApiProperty({ example: 'jane@example.com' })
  // @IsEmail()
  // userEmail: string;

  @ApiProperty({ example: 'ABCDE Limited' })
  @IsNotEmpty()
  @Length(6, 255)
  companyName: string;

  @ApiProperty({ example: 'abcde@name.com' })
  @IsNotEmpty()
  @Length(2, 255)
  companyEmail?: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsNotEmpty()
  @Length(7, 14)
  companyPhoneNumber?: string;

  @ApiProperty({
    example: '22, ABCDEF street allocation road, lagos, Nigeria.',
  })
  @IsNotEmpty()
  @Length(7, 14)
  address?: string;

  @ApiProperty({ example: 'https://abcdeltd.com' })
  @IsNotEmpty()
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
