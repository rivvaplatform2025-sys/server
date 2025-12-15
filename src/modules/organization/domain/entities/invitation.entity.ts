import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { InvitationStatus } from '../enums/invitation-status.enum';

@Entity('organization_invitations')
export class OrganizationInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'enum', enum: InvitationStatus })
  status: InvitationStatus;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Organization, { eager: true })
  organization: Organization;

  @ManyToOne(() => User, { nullable: true })
  invitedBy?: User;
}
