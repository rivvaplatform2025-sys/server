import { Campaign } from 'src/modules/campaign/domain/entities/campaign.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetTypeStatus } from '../enums/asset-type-status.enum';

@Entity('creative_assets')
export class CreativeAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  fileUrl: string; // Supabase storage

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: AssetTypeStatus,
    default: AssetTypeStatus.IMAGE,
  })
  type: AssetTypeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Campaign, (c) => c.assets)
  campaign: Campaign;

  @ManyToOne(() => User, (u) => u.assignments)
  createdBy: User;
}
