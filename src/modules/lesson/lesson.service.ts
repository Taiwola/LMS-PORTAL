import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { UserService } from '../user/user.service';
import { TutorialService } from '../tutorial/tutorial.service';
import { UserRoles } from '../user/entities/user.entity';
import { UploadService } from '../service/upload/upload.service';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    private userService: UserService,
    private tutorialService: TutorialService,
    private uploadService: UploadService,
  ) {}

  async create(
    id: string,
    createLessonDto: CreateLessonDto,
    req: Request,
    image: Express.Multer.File,
    images: Express.Multer.File[],
    video: Express.Multer.File,
  ): Promise<Lesson> {
    const tut = await this.tutorialService.findOne(id);
    const userId = req.userID.id;
    if (!tut) {
      throw new HttpException('Tutorial Not Found', HttpStatus.NOT_FOUND);
    }
    if (userId !== tut.tutor.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    let imgUrl: string | null;
    if (image) {
      const img = await this.uploadService.uploadFile(image);
      imgUrl = img.url as string;
    } else {
      imgUrl = null;
    }

    let imgArray: string[] | null;
    if (images) {
      const imgs = await this.uploadService.uploadMultipleFiles(images);
      imgArray = imgs.map((imgs) => {
        return imgs.url as string;
      });
    } else {
      imgArray = null;
    }

    let vidUrl: string | null;
    if (video) {
      const vid = await this.uploadService.uploadVideo(video);
      vidUrl = vid.url as string;
    } else {
      vidUrl = null;
    }

    const lesson = this.lessonRepository.create({
      image: imgUrl,
      images: imgArray,
      video: vidUrl,
      link: createLessonDto.link,
      text: createLessonDto.text,
      tutorial: tut,
    });

    const savedLesson = await this.lessonRepository.save(lesson);
    return savedLesson;
  }

  async findAll(): Promise<Lesson[]> {
    const lesson = await this.lessonRepository.find();
    return lesson;
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: id },
    });
    return lesson;
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
    req: Request,
    image: Express.Multer.File,
    images: Express.Multer.File[],
    video: Express.Multer.File,
  ): Promise<Lesson> {
    const lesson = await this.findOne(id);
    if (!lesson) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const tutorId = lesson.tutorial.tutor.id;
    if (req.userID.id !== tutorId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const img = await this.uploadService.uploadFile(image);
    const imgUrl = img.url as string;
    const imgs = await this.uploadService.uploadMultipleFiles(images);
    const imgArray = imgs.map((imgs) => {
      return imgs.url as string;
    });
    const vid = await this.uploadService.uploadVideo(video);
    const vidUrl = vid.url as string;
    const updateLesson = await this.lessonRepository
      .createQueryBuilder()
      .update(Lesson)
      .set({
        video: vidUrl,
        image: imgUrl,
        images: imgArray,
        text: updateLessonDto.text,
        link: updateLessonDto.link,
      })
      .where('id = :id', { id: id })
      .execute();

    if (updateLesson.affected >= 1) {
      const updatedLesson = await this.findOne(id);
      return updatedLesson;
    } else {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, req: Request) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: id },
    });
    const user = await this.userService.checkUserById(req.userID.id);
    if (!lesson) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const tutorId = lesson.tutorial.tutor.id;
    if (user.id !== tutorId && user.roles !== UserRoles.ADMIN) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const removeLesson = await this.lessonRepository.delete(id);
    return {
      message: 'lesson removed',
      data: removeLesson,
    };
  }
}
