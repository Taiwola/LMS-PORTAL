import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { TutorialCategory } from '../../tutorial-category/entities/tutorial-category.entity';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { User } from '../../user/entities/user.entity';
import { Course } from '../../course/entities/course.entity';

export enum TutorialType {
  FREE = 'Free',
  PAID = 'Paid',
}

@Entity()
export class Tutorial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  topicName: string;

  @Column()
  content: string;

  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
  })
  keywords: string[];

  @ManyToOne(() => User, (tutor) => tutor.tutorial)
  tutor: User;

  @Column({
    default:
      'data:image/jpeg;base64,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',
    nullable: true,
  })
  image: string | null;

  @Column({
    type: 'enum',
    enum: TutorialType,
  })
  status: TutorialType;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  price: number | null;

  // Many tutorial can belong to one category
  @ManyToOne(() => TutorialCategory, (category) => category.tutorial)
  category: TutorialCategory;

  @OneToMany(() => Lesson, (lesson) => lesson.tutorial)
  lessons: Lesson[];

  @OneToOne(() => Course, (course) => course.tutorial)
  course: Course;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
