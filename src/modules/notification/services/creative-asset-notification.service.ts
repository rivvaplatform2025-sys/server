import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationTemplate } from '../domain/entities/notification-template.entity';
import { Repository } from 'typeorm';
import { renderTemplate } from 'src/common/helpers/render-template.helper';
import {
  IApproveRejectAssetNotification,
  ISubmitAssetNotification,
} from 'src/shared/dto/email-notification.dto';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CreativeAssetStatus } from 'src/modules/assets/domain/enums/asset-status.enum';

@Injectable()
export class CreativeAssetNotificationService {
  constructor(
    private readonly mailer: MailerService,
    @InjectRepository(NotificationTemplate)
    private readonly templateRepo: Repository<NotificationTemplate>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /* -----------------------------------------
   * ASSET SUBMITTED → CAMPAIGN MANAGERS
   * ----------------------------------------*/
  async notifyAssetSubmitted(data: ISubmitAssetNotification) {
    const managers = await this.userRepo.find({
      where: {
        organization: { id: data.organizationId },
        userRoles: {
          role: { name: 'Brand Manager' },
        },
      },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!managers)
      throw new Error('Campaign Manager organization details not found.');

    const template = await this.templateRepo.findOne({
      where: {
        channel: 'email',
        type: { key: 'ASSET_SUBMITTED' },
      },
      relations: ['type'],
    });
    if (!template) throw new Error('ASSET_SUBMITTED email template not found');

    for (const manager of managers) {
      await this.mailer.send({
        to: manager.email,
        subject: template.subject,
        html: renderTemplate(template.body, {
          full_name: `${manager.firstName} ${manager.lastName}`,
          organizationName: data.organizationName,
          campaignTitle: data.campaignTitle,
          assetTitle: data.assetTitle,
          creatorName: data.creatorName,
          reviewUrl: data.reviewUrl,
        }),
      });
    }
  }

  /* -----------------------------------------
   * ASSET APPROVED / REJECTED → CREATOR
   * ----------------------------------------*/
  async notifyAssetDecision(data: IApproveRejectAssetNotification) {
    const key =
      data.status === CreativeAssetStatus.APPROVED
        ? 'ASSET_APPROVED'
        : 'ASSET_REJECTED';

    const template = await this.templateRepo.findOne({
      where: {
        type: { key },
        channel: 'email',
      },
      relations: ['type'],
    });
    if (!template) throw new Error(`${key} email template not found`);

    await this.mailer.send({
      to: data.creatorEmail,
      subject: template.subject,
      html: renderTemplate(template.body, {
        organizationName: data.organizationName,
        full_name: data.creatorName,
        assetTitle: data.assetTitle,
        campaignTitle: data.campaignTitle,
        status: data.status.toUpperCase(),
        assetUrl: data.fileUrl,
      }),
    });
  }
}
