import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';

@Entity('campaign_comments')
export class CampaignComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Campaign, (c) => c.comments)
  campaign: Campaign;

  @ManyToOne(() => User, (u) => u.id)
  user: User;
}
