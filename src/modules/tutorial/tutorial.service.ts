import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutorial, TutorialType } from './entities/tutorial.entity';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { TutorialCategoryService } from '../tutorial-category/tutorial-category.service';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { UploadService } from '../service/upload/upload.service';
import { UserRoles } from '../user/entities/user.entity';

@Injectable()
export class TutorialService {
  constructor(
    @InjectRepository(Tutorial)
    private tutorialRepository: Repository<Tutorial>,
    private categoryService: TutorialCategoryService,
    private userService: UserService,
    private uploadService: UploadService,
  ) {}

  // utility methods
  async findOneTutorial(id: string) {
    const tutorial = await this.tutorialRepository.findOne({
      where: { id: id },
      relations: ['user', 'lessons'],
    });
    return tutorial;
  }

  // CRUD methods
  async create(
    createTutorial: CreateTutorialDto,
    req: Request,
    file: Express.Multer.File,
  ) {
    const { id } = req.userID;
    const user = await this.userService.checkUserById(id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }

    const { category } = createTutorial;
    const findCategory = await this.categoryService.findCategory(category);

    if (!findCategory) {
      throw new HttpException('category does not exist', HttpStatus.NOT_FOUND);
    }

    const { image } = createTutorial;
    let imgUrl: string | null;
    if (!image) {
      imgUrl = null;
    } else {
      const img = await this.uploadService.uploadFile(file);
      imgUrl = img.url as string;
    }

    let { status, price } = createTutorial;
    if (!price) {
      status = TutorialType.FREE;
      price = null;
    } else {
      status = TutorialType.PAID;
    }

    const createTut = this.tutorialRepository.create({
      title: createTutorial.title,
      topicName: createTutorial.topicName,
      tutor: user,
      category: findCategory,
      content: createTutorial.content,
      keywords: createTutorial.keywords,
      image: imgUrl,
      status: status,
      price: price,
    });

    return await this.tutorialRepository.save(createTut);
  }

  async findAll() {
    return await this.tutorialRepository.find();
  }

  async findOne(id: string) {
    const tutorial = await this.findOneTutorial(id);
    return tutorial;
  }

  async updateTutorial(
    id: string,
    updateTutorial: UpdateTutorialDto,
    req: Request,
    file: Express.Multer.File,
  ) {
    const findTut = await this.findOneTutorial(id);
    if (!findTut) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const userId = req.userID;
    const user = await this.userService.checkUserById(userId.id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }

    const { category } = updateTutorial;
    const findCategory = await this.categoryService.findCategory(category);

    if (!findCategory) {
      throw new HttpException('category does not exist', HttpStatus.NOT_FOUND);
    }

    if (user.id !== findTut.tutor.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const { image } = updateTutorial;
    let imgUrl: string;
    if (!image) {
      imgUrl = findTut.image;
    } else {
      const img = await this.uploadService.uploadFile(file);
      imgUrl = img.url as string;
    }

    const updateTut = await this.tutorialRepository
      .createQueryBuilder()
      .update(Tutorial)
      .set({
        title: updateTutorial.title,
        topicName: updateTutorial.topicName,
        keywords: updateTutorial.keywords,
        image: imgUrl,
      })
      .where('id = :id', { id: id })
      .execute();

    if (updateTut.affected >= 1) {
      const updatedTut = await this.findOneTutorial(id);
      return updatedTut;
    } else {
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePrice(
    id: string,
    updateTutorial: UpdateTutorialDto,
    req: Request,
  ) {
    const findTut = await this.findOneTutorial(id);
    if (!findTut) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const userId = req.userID;
    const user = await this.userService.checkUserById(userId.id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }

    const { category } = updateTutorial;
    const findCategory = await this.categoryService.findCategory(category);

    if (!findCategory) {
      throw new HttpException('category does not exist', HttpStatus.NOT_FOUND);
    }

    if (user.id !== findTut.tutor.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    let { price, status } = updateTutorial;
    if (!price) {
      status = TutorialType.FREE;
      price = null;
    } else {
      status = TutorialType.PAID;
    }

    const updatePrice = await this.tutorialRepository
      .createQueryBuilder()
      .update(Tutorial)
      .set({
        price: price,
        status: status,
      })
      .where('id = :id', { id: id })
      .execute();
    if (updatePrice.affected >= 1) {
      const updatedTut = await this.findOneTutorial(id);
      return updatedTut;
    }
  }

  async changeCategory(
    id: string,
    updateTutorial: UpdateTutorialDto,
    req: Request,
  ) {
    const findTut = await this.findOneTutorial(id);
    const { category } = updateTutorial;
    const userId = req.userID.id;
    const user = await this.userService.checkUserById(userId);
    const findCat = await this.categoryService.findCategory(category);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    if (!findCat) {
      throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
    }
    if (!findTut) {
      throw new HttpException('Tutorial Not Found', HttpStatus.NOT_FOUND);
    }
    const updateCat = await this.tutorialRepository
      .createQueryBuilder()
      .update(Tutorial)
      .set({ category: findCat })
      .where('id = :id', { id: id })
      .execute();
    if (updateCat.affected >= 1) {
      const updatedCat = await this.findOneTutorial(id);
      return updatedCat;
    }
  }

  async remove(id: string, req: Request) {
    const findTut = await this.findOneTutorial(id);
    const userId = req.userID.id;
    const user = await this.userService.checkUserById(userId);
    if (!findTut) {
      throw new HttpException('Tutorial not found', HttpStatus.NOT_FOUND);
    }
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.id !== findTut.tutor.id && user.roles !== UserRoles.ADMIN) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const deleteTut = await this.tutorialRepository.delete(id);
    return {
      message: 'tutorial deleted',
      data: deleteTut,
    };
  }

  async addKeywords(id: string, updateTutorial: UpdateTutorialDto) {
    const tut = await this.findOneTutorial(id);
    if (!tut) {
      throw new HttpException('Tutorial not found', HttpStatus.NOT_FOUND);
    }

    const updateKeyWord = await this.tutorialRepository
      .createQueryBuilder()
      .update(Tutorial)
      .set({ keywords: updateTutorial.keywords })
      .where('id = :id', { id: id })
      .execute();

    if (updateKeyWord.affected >= 1) {
      const updatedTut = await this.findOneTutorial(id);
      return updatedTut;
    } else {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
