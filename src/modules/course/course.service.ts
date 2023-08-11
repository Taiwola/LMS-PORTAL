import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { TutorialService } from '../tutorial/tutorial.service';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    private tutorialService: TutorialService,
    private userService: UserService,
  ) {}

  // utility function
  async findOneCourse(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id: id },
    });
    return course;
  }

  async create(id: string, req: Request) {
    const tut = await this.tutorialService.findOneTutorial(id);
    if (!tut) {
      throw new HttpException('tutorial does not exist', HttpStatus.NOT_FOUND);
    }
    const user = await this.userService.checkUserById(req.user.id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }

    const createCourse = this.courseRepository.create({
      user: user,
      tutorial: tut,
    });

    const newCourse = await this.courseRepository.save(createCourse);

    return {
      message: 'course created',
      successful: true,
      data: newCourse,
    };
  }

  async findAll(req: Request) {
    const course = await this.courseRepository.find({
      where: { user: { id: req.user.id } },
    });
    return course;
  }

  async remove(id: string) {
    const course = await this.findOneCourse(id);
    if (!course) {
      throw new HttpException('course not found', HttpStatus.NOT_FOUND);
    }
    const deleteCourse = await this.courseRepository.delete(id);
    return deleteCourse;
  }
}
