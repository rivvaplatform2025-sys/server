import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampaignStatus } from '../enums/campaign-status.enum';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CampaignAssignment } from './campaign-assignment.entity';
import { CreativeAsset } from 'src/modules/assets/domain/entities/creative-assets.entity';
import { CampaignComment } from './campaign-comment.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { Platform } from 'src/modules/platform/domain/entities/platform.entity';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  budget: {
    amount: number;
    currency: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.managedCampaigns)
  manager: User;

  @ManyToOne(() => Organization, (org) => org.campaigns)
  organization: Organization;

  @OneToMany(() => CampaignAssignment, (a) => a.campaign)
  assignments: CampaignAssignment[];

  @OneToMany(() => CreativeAsset, (asset) => asset.campaign)
  assets: CreativeAsset[];

  @OneToMany(() => CampaignComment, (c) => c.campaign)
  comments: CampaignComment[];

  @ManyToMany(() => Platform, (platform) => platform.campaigns)
  @JoinTable({
    name: 'campaign_platforms',
    joinColumn: { name: 'campaign_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'platform_id', referencedColumnName: 'id' },
  })
  platforms: Platform[];
}
