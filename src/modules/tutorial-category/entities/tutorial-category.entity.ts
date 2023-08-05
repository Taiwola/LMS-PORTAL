import { Tutorial } from '../../tutorial/entities/tutorial.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class TutorialCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  Category: string;

  // One category can have multiple tutorials
  @OneToMany(() => Tutorial, (tutorial) => tutorial.category)
  tutorial: Tutorial[];
}
