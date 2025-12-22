// src/modules/users/domain/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VerificationToken } from '../../../verification/domain/entities/verification-token.entity';
import { UserRole } from './user-role';
import { RefreshToken } from 'src/modules/auth/domain/entities/refresh-token.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { CategoryType } from 'src/modules/category/domain/entities/category-type.entity';
import { Campaign } from 'src/modules/campaign/domain/entities/campaign.entity';
import { CampaignAssignment } from 'src/modules/campaign/domain/entities/campaign-assignment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Organization, (org) => org.users, { nullable: true })
  organization: Organization | null;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHashed: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles: UserRole[];

  @OneToMany(() => VerificationToken, (vt) => vt.user)
  verificationTokens: VerificationToken[];

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens: RefreshToken[];

  @ManyToMany(() => CategoryType, (category) => category.users)
  @JoinTable({
    name: 'user_categorytypes',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: CategoryType[];

  @OneToMany(() => Campaign, (c) => c.manager)
  managedCampaigns: Campaign[];

  @OneToMany(() => CampaignAssignment, (a) => a.user)
  assignments: CampaignAssignment[];
}
