import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignAssignment } from 'src/modules/campaign/domain/entities/campaign-assignment.entity';
import { NotificationTemplate } from '../domain/entities/notification-template.entity';
import { Repository } from 'typeorm';
import { renderTemplate } from 'src/common/helpers/render-template.helper';
import { ICampaignAssignmentNotification } from 'src/shared/dto/email-notification.dto';
import { MailerService } from 'src/shared/mailer/mailer.service';

@Injectable()
export class AssignmentNotificationService {
  constructor(
    private readonly mailer: MailerService,
    @InjectRepository(NotificationTemplate)
    private readonly templateRepo: Repository<NotificationTemplate>,
  ) {}

  async sendCampaignAssignmentEmail(data: ICampaignAssignmentNotification) {
    const template = await this.templateRepo.findOne({
      where: {
        channel: 'email',
        type: { key: 'CAMPAIGN_ASSIGNMENT' },
      },
      relations: ['type'],
    });

    if (!template)
      throw new Error('CAMPAIGN_ASSIGNMENT email template not found');

    await this.mailer.send({
      to: data.recipientEmail,
      subject: template.subject,
      html: renderTemplate(template.body, {
        recipientName: data.recipientName,
        organizationName: data.organizationName,
        campaignTitle: data.campaignTitle,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate,
        acceptUrl: data.acceptUrl,
        rejectUrl: data.rejectUrl,
        year: '2026',
      }),
    });
  }

  async notifyAssignment(assignments: CampaignAssignment[]) {
    for (const assignment of assignments) {
      await this.sendCampaignAssignmentEmail({
        recipientEmail: assignment.user.email,
        recipientName: `${assignment.user.firstName} ${assignment.user.lastName}`,
        organizationName: assignment.campaign.organization.name,
        campaignTitle: assignment.campaign.title,
        role: assignment.role,
        startDate: assignment.campaign.startDate.toDateString(),
        endDate: assignment.campaign.endDate.toDateString(),
        acceptUrl: `${process.env.APP_URL}/assignments/${assignment.id}/accept`,
        rejectUrl: `${process.env.APP_URL}/assignments/${assignment.id}/reject`,
      });
    }
  }
}
