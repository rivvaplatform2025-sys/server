// src/modules/organization/domain/entities/organization.entity.ts
import { Campaign } from 'src/modules/campaign/domain/entities/campaign.entity';
import { User } from '../../../users/domain/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  website: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  address?: string;

  @ManyToOne(() => User, { nullable: true })
  owner: User;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Campaign, (campaign) => campaign.organization)
  campaigns: Campaign[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
