import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { VerificationToken } from '../../../verification/domain/entities/verification-token.entity';
import { UserRole } from './user-role';
import { RefreshToken } from 'src/modules/auth/domain/entities/refresh-token.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Organization, (org) => org.users, { nullable: true })
  organization: Organization;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHashed: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

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
}
