import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
