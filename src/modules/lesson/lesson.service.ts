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
    document: Express.Multer.File,
  ): Promise<Lesson> {
    const tut = await this.tutorialService.findOneTutorial(id);
    const userId = req.user.id;
    if (!tut) {
      throw new HttpException('Tutorial Not Found', HttpStatus.NOT_FOUND);
    }

    if (userId !== tut.tutor.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    let imgUrl: string | null;
    if (image) {
      console.log(image);
      const img = await this.uploadService.upload(image);
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

    let documentLink: string | null;
    if (document) {
      const doc = await this.uploadService.uploadDoc(document);
      documentLink = doc.url as string;
    } else {
      documentLink = null;
    }

    const lesson = this.lessonRepository.create({
      title: createLessonDto.title,
      image: imgUrl,
      images: imgArray,
      video: vidUrl,
      link: createLessonDto.link,
      text: createLessonDto.text,
      tutorial: tut,
      document: documentLink,
    });

    const savedLesson = await this.lessonRepository.save(lesson);
    return savedLesson;
  }

  async findAll(): Promise<Lesson[]> {
    const lesson = await this.lessonRepository.find({
      relations: ['tutorial'],
    });
    return lesson;
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: id },
      relations: ['tutorial'],
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
    document: Express.Multer.File,
  ): Promise<Lesson> {
    const lesson = await this.findOne(id);
    if (!lesson) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const tut = await this.tutorialService.findOneTutorial(lesson.tutorial.id);
    const tutorId = tut.tutor.id;
    if (req.user.id !== tutorId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const img = image ? await this.uploadService.upload(image) : null;
    const imgUrl = img ? (img.url as string) : lesson.image;
    const doc = document ? await this.uploadService.uploadDoc(document) : null;
    const docLink = doc ? (doc.url as string) : lesson.document;
    const imgs = images
      ? await this.uploadService.uploadMultipleFiles(images)
      : null;
    const imgArray = imgs
      ? imgs.map((imgs) => {
          return imgs.url as string;
        })
      : lesson.images;
    const vid = video ? await this.uploadService.uploadVideo(video) : null;
    const vidUrl = vid ? (vid.url as string) : lesson.video;
    const updateLesson = await this.lessonRepository
      .createQueryBuilder()
      .update(Lesson)
      .set({
        video: vidUrl,
        image: imgUrl,
        images: imgArray,
        document: docLink,
        text: updateLessonDto.text,
        link: updateLessonDto.link,
        title: updateLessonDto.title,
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
      relations: ['tutorial'],
    });
    const user = await this.userService.checkUserById(req.user.id);
    if (!lesson) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const tut = await this.tutorialService.findOneTutorial(lesson.tutorial.id);
    const tutorId = tut.tutor.id;
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
