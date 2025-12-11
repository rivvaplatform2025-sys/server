import { User } from 'src/modules/users/domain/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('category_types')
export class CategoryType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g. fashion, tech, religion, sports

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.categories)
  users: User[];
}
