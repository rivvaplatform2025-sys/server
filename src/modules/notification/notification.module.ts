import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentNotificationService } from '../notification/services/assignment-notification.service';
import { NotificationTemplate } from './domain/entities/notification-template.entity';
import { NotificationType } from './domain/entities/notification-type.entity';
import { MailerModule } from 'src/shared/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationTemplate, NotificationType]),
    MailerModule,
  ],
  providers: [AssignmentNotificationService],
  exports: [AssignmentNotificationService],
})
export class NotificationModule {}
