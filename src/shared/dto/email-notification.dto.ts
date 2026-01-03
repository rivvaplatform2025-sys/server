import { CreativeAssetStatus } from 'src/modules/assets/domain/enums/asset-status.enum';

export interface ICampaignAssignmentNotification {
  recipientEmail: string;
  recipientName: string;
  organizationName: string;
  campaignTitle: string;
  role: string;
  startDate: string;
  endDate: string;
  acceptUrl: string;
  rejectUrl: string;
}

export interface ISubmitAssetNotification {
  organizationId: string;
  organizationName: string;
  campaignTitle: string;
  assetTitle: string;
  creatorName: string;
  reviewUrl: string;
}

export interface IApproveRejectAssetNotification {
  status: CreativeAssetStatus;
  creatorName: string;
  creatorEmail: string;
  assetTitle: string;
  campaignTitle: string;
  organizationName: string;
  fileUrl: string;
}
