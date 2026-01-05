// src/modules/inbox/domain/entities/conversation-participant.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { RoleApplicationEnum } from 'src/modules/role/domain/enum/role-application.enum';

@Entity('conversation_participants')
@Unique(['conversation', 'user'])
@Index('idx_cp_user_conv', ['user', 'conversation'])
export class ConversationParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (c) => c.participants, {
    onDelete: 'CASCADE',
  })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'enum',
    enum: RoleApplicationEnum,
  })
  role: RoleApplicationEnum;

  @Column({ type: 'uuid', nullable: true })
  lastReadMessageId?: string;

  @Column({ default: false })
  isMuted: boolean;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  leftAt?: Date;
}
