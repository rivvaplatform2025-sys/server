import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ConversationTypeEnum } from '../../domain/enum/conversation-type.enum';
import { RoleApplicationEnum } from 'src/modules/role/domain/enum/role-application.enum';

export class CreateConversationDto {
  @ApiProperty({ example: 'Influencer Launch Campaign' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ enum: ConversationTypeEnum })
  @IsEnum(ConversationTypeEnum)
  type: ConversationTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @ApiProperty({
    type: [Object],
    example: [{ userId: 'uuid', role: RoleApplicationEnum.BRAND_MANAGER }],
  })
  @IsArray()
  participantIds: {
    userId: string;
    role: RoleApplicationEnum;
  }[];
}
