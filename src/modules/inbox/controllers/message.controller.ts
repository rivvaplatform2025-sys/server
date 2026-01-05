import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MessageCommandService } from '../services/message-command.service';
import { MessageQueryService } from '../services/message-query.service';
import { InboxAuthorizationService } from '../services/inbox-authorization.service';
import { MessageResponseDto } from '../application/dto/response/message-response.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { SendMessageDto } from '../application/dto/send-message.dto';
import { CurrentOrganization } from 'src/modules/auth/decorators/current-organization.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('Inbox - Messages')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'inbox/conversations/:conversationId/messages',
  version: '1',
})
export class MessageController {
  constructor(
    private readonly commandService: MessageCommandService,
    private readonly queryService: MessageQueryService,
    private readonly authorization: InboxAuthorizationService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: MessageResponseDto })
  async sendMessage(
    @CurrentUser() user: User,
    @CurrentOrganization() organizationId: string,
    @Param('conversationId') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    await this.authorization.assertConversationAccess(
      user.id,
      conversationId,
      organizationId,
    );
    return this.commandService.sendMessage({ ...dto, conversationId }, user.id);
  }

  @Get()
  @ApiOkResponse({
    description: 'Conversation messages',
    type: MessageResponseDto,
    isArray: true,
  })
  async getMessages(
    @CurrentUser() user: User,
    @CurrentOrganization() organizationId: string,
    @Param('conversationId') conversationId: string,
    @Query() pagination: PaginationDto,
  ) {
    await this.authorization.assertConversationAccess(
      user.id,
      conversationId,
      organizationId,
    );
    return this.queryService.getUserMessages(conversationId, pagination);
  }
}
