// src/modules/inbox/domain/entities/message.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { MessageTypeEnum } from '../enum/message-type.enum';

@Entity('messages')
@Index('idx_msg_conv_created', ['conversation', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (c) => c.messages, {
    onDelete: 'CASCADE',
  })
  conversation: Conversation;

  @ManyToOne(() => User)
  sender: User;

  @Column({
    type: 'enum',
    enum: MessageTypeEnum,
    default: MessageTypeEnum.TEXT,
  })
  type: MessageTypeEnum;

  @Column({ type: 'text', nullable: true })
  content: string;

  // Supabase Storage URLs
  @Column({ type: 'jsonb', nullable: true })
  attachments?: {
    url: string;
    name: string;
    size: number;
    mimeType: string;
  }[];

  @Column({ default: false })
  isEdited: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
