import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Tutorial } from '../../tutorial/entities/tutorial.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.lessons)
  tutorial: Tutorial;
}
