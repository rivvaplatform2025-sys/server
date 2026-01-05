import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConversationCommandService } from '../services/conversation-command.service';
import { ConversationQueryService } from '../services/conversation-query.service';
import { ConversationResponseDto } from '../application/dto/response/conversation-response.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { CreateConversationDto } from '../application/dto/create-conversation.dto';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CurrentOrganization } from 'src/modules/auth/decorators/current-organization.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('Inbox - Conversations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'inbox/conversations', version: '1' })
export class ConversationController {
  constructor(
    private readonly commandService: ConversationCommandService,
    private readonly queryService: ConversationQueryService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ConversationResponseDto })
  async createConversation(
    @CurrentUser() user: User,
    @CurrentOrganization() organizationId: string,
    @Body() dto: CreateConversationDto,
  ) {
    //return await this.commandService.createConversation(dto, user.id);
    return await this.commandService.create(user.id, organizationId, dto);
  }

  @Get()
  @ApiOkResponse({
    description: 'User inbox Conversation',
    type: ConversationResponseDto,
    isArray: true,
  })
  getInbox(
    @CurrentUser() user: User,
    @CurrentOrganization() organizationId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.queryService.getInbox(user.id, organizationId, pagination);
  }
}
