import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from './notification-type.entity';

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => NotificationType, (nt) => nt.templates, {
    onDelete: 'CASCADE',
  })
  type: NotificationType;

  @Column()
  channel: string; // email | sms | push | in_app

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
