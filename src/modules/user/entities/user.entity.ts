import { Tutorial } from '../../tutorial/entities/tutorial.entity';
import { Course } from '../../course/entities/course.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRoles {
  ADMIN = 'Admin',
  USER = 'User',
  tutor = 'Tutor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  firstname: string;

  @Column({
    type: 'varchar',
  })
  lastname: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  about_me: string;

  @Column({
    type: 'numeric',
    unique: true,
  })
  mobile: number;

  @Column({
    type: 'varchar',
  })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    default:
      'https://toppng.com/uploads/preview/file-svg-profile-icon-vector-11562942678pprjdh47a8.png',
  })
  profileImg: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  roles: UserRoles;

  @Column({
    type: 'boolean',
    default: false,
  })
  isBlocked: boolean;

  @Column({
    type: 'varchar',
  })
  profession: string;

  @OneToMany(() => Tutorial, (tutorial) => tutorial.tutor)
  tutorial: Tutorial[];

  @OneToMany(() => Course, (course) => course.user)
  courses: Course[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
