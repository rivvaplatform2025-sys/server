import { NotificationTemplate } from 'src/modules/notification/domain/entities/notification-template.entity';
import { NotificationType } from 'src/modules/notification/domain/entities/notification-type.entity';
import { DataSource } from 'typeorm';

type TNotificationTemplateProps = {
  channel: 'email' | 'sms' | 'in_app' | 'push';
  subject: string;
  body: string;
};

interface INotificationTypeProps {
  key: string;
  description: string;
  templates: TNotificationTemplateProps[];
}

export const notificationsSeed = async (dataSource: DataSource) => {
  const typeRepo = dataSource.getRepository(NotificationType);
  const templateRepo = dataSource.getRepository(NotificationTemplate);

  const notificationTypes: INotificationTypeProps[] = [
    {
      key: 'ASSET_SUBMITTED',
      description:
        'Triggered when a creator submits a creative asset for a campaign. This notification is sent to campaign managers to inform them that a new asset is ready for review and approval.',
      templates: [
        {
          channel: 'email',
          subject: 'New Creative Asset Submitted for {{campaignTitle}}',
          body: 'Hello {{name}}, please verify your account using this code: {{token}}.',
        },
      ],
    },
    {
      key: 'ASSET_APPROVED',
      description:
        'Triggered when a submitted creative asset is approved by a campaign manager. This notification informs the creator that their asset has been accepted for use in the campaign.',
      templates: [
        {
          channel: 'email',
          subject: 'Your asset has been approved 🎉',
          body: 'Hello {{name}}, please verify your account using this code: {{token}}.',
        },
      ],
    },
    {
      key: 'ASSET_REJECTED',
      description:
        'Triggered when a submitted creative asset is rejected by a campaign manager. This notification informs the creator that revisions are required before the asset can be approved.',
      templates: [
        {
          channel: 'email',
          subject: 'Your asset needs revision',
          body: 'Hello {{name}}, please verify your account using this code: {{token}}.',
        },
      ],
    },
  ];

  // const notificationTypes = [
  //   {
  //     key: 'USER_VERIFICATION',
  //     description:
  //       'Triggered when a user registers and must verify their account.',
  //     templates: [
  //       {
  //         channel: 'email',
  //         subject: 'Verify Your Account',
  //         body: 'Hello {{name}}, please verify your account using this code: {{token}}.',
  //       },
  //       {
  //         channel: 'in_app',
  //         subject: null,
  //         body: 'Your verification code is: {{token}}',
  //       },
  //     ],
  //   },
  //   {
  //     key: 'PASSWORD_RESET',
  //     description: 'Sent when a user requests a password reset.',
  //     templates: [
  //       {
  //         channel: 'email',
  //         subject: 'Reset Your Password',
  //         body: 'Click the link to reset your password: {{reset_link}}.',
  //       },
  //     ],
  //   },
  //   {
  //     key: 'CAMPAIGN_CREATED',
  //     description: 'Notification when a new campaign is created.',
  //     templates: [
  //       {
  //         channel: 'in_app',
  //         subject: null,
  //         body: 'A new campaign "{{campaign_name}}" has been created.',
  //       },
  //     ],
  //   },
  //   {
  //     key: 'CAMPAIGN_APPROVED',
  //     description: 'Sent when a created campaign is approved.',
  //     templates: [
  //       {
  //         channel: 'email',
  //         subject: 'Your Campaign Has Been Approved',
  //         body: 'Your campaign "{{campaign_name}}" is now approved and ready to go live.',
  //       },
  //     ],
  //   },
  // ];

  for (const item of notificationTypes) {
    let type = await typeRepo.findOne({
      where: { key: item.key },
      relations: ['templates'],
    });

    // Create NotificationType if it doesn't exist
    if (!type) {
      type = await typeRepo.save({
        key: item.key,
        description: item.description,
      });
    }

    // Seed templates for this type
    for (const tpl of item.templates) {
      const exists = await templateRepo.findOne({
        where: {
          type: { id: type.id },
          channel: tpl.channel,
        },
      });

      if (!exists) {
        const template = new NotificationTemplate();
        template.type = type;
        template.channel = tpl.channel;
        template.subject = tpl.subject!;
        template.body = tpl.body;

        await templateRepo.save(template);
      }
    }
  }

  console.log('✅ Notification types & templates seeded successfully.');
};
