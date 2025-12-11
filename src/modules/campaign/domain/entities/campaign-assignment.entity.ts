import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { Campaign } from './campaign.entity';
import { CampaignRole } from '../enums/campaign-role.enum';
import { AssignmentStatus } from '../enums/assignment-status.enum';

@Entity('campaign_assignments')
export class CampaignAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.assignments)
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.assignments)
  campaign: Campaign;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: CampaignRole,
    default: CampaignRole.CREATOR,
  })
  role: CampaignRole;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.PENDING,
  })
  status: AssignmentStatus;
}
