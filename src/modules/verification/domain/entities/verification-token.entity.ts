import { User } from '../../../users/domain/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('verification_tokens')
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.verificationTokens, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  token: string;

  @Column()
  type: string; // email_verification | password_reset

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
