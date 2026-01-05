// src/modules/inbox/domain/entities/conversation.entity.ts
import { Campaign } from 'src/modules/campaign/domain/entities/campaign.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationParticipant } from './conversation-participant.entity';
import { Message } from './message.entity';
import { ConversationTypeEnum } from '../enum/conversation-type.enum';
import { ConversationStatusEnum } from '../enum/conversation-status.enum';
import { User } from 'src/modules/users/domain/entities/user.entity';

@Entity('conversations')
@Index('idx_conv_org_last_msg', ['organization', 'lastMessageAt'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column({
    type: 'enum',
    enum: ConversationTypeEnum,
    default: ConversationTypeEnum.DM,
  })
  type: ConversationTypeEnum;

  @Column({
    type: 'enum',
    enum: ConversationStatusEnum,
    default: ConversationStatusEnum.ACTIVE,
  })
  status: ConversationStatusEnum;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @ManyToOne(() => Campaign, { nullable: true })
  campaign?: Campaign;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ type: 'uuid', nullable: true })
  lastMessageId?: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastMessageAt?: Date;

  @OneToMany(() => ConversationParticipant, (p) => p.conversation)
  participants: ConversationParticipant[];

  @OneToMany(() => Message, (m) => m.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
