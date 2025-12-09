import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Jane' })
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: 'Designer or Creator' })
  @IsNotEmpty()
  roleName: string;
}
