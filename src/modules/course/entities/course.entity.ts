import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Tutorial } from '../../tutorial/entities/tutorial.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.courses)
  user: User;

  @OneToOne(() => Tutorial, (tutorial) => tutorial.course)
  @JoinColumn()
  tutorial: Tutorial;
}
