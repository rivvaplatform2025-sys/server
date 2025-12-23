// src/modules/platform/domain/entities/platform.entity.ts
import { Campaign } from 'src/modules/campaign/domain/entities/campaign.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // instagram, tiktok, twitter, youtube

  @Column({ nullable: true })
  iconUrl: string; // optional (store icon in supabase)

  @ManyToMany(() => Campaign, (campaign) => campaign.platforms)
  campaigns: Campaign[];
}
