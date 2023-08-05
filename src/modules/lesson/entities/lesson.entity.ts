import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Tutorial } from '../../tutorial/entities/tutorial.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    array: true,
    type: 'simple-array',
  })
  images: string[] | null;

  @Column({
    nullable: true,
    type: 'text',
  })
  image: string | null;

  @Column({ nullable: true, type: 'varchar' })
  video: string | null;

  @Column({ nullable: true, type: 'text' })
  text: string | null;

  @Column({ nullable: true, type: 'text' })
  document: string | null;

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.lessons)
  tutorial: Tutorial;
}
