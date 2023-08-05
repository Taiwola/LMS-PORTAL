import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTutorialCategoryDto } from './dto/create-tutorial-category.dto';
import { UpdateTutorialCategoryDto } from './dto/update-tutorial-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorialCategory } from './entities/tutorial-category.entity';

@Injectable()
export class TutorialCategoryService {
  constructor(
    @InjectRepository(TutorialCategory)
    private categoryRepository: Repository<TutorialCategory>,
  ) {}

  // utility methods
  async findCategory(category: string) {
    const categoryExist = await this.categoryRepository.findOne({
      where: { Category: category },
    });
    return categoryExist;
  }

  async findCatId(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    return category;
  }

  async findAllCategory() {
    const category = await this.categoryRepository.find({
      relations: ['tutorial'],
    });

    return category;
  }

  // findAllCatWoRel: find all category without relations
  async findAllCatWoRel() {
    const category = await this.categoryRepository.find();
    return category;
  }

  // CRUD METHODS
  async create(createTutorialCategoryDto: CreateTutorialCategoryDto) {
    const { category } = createTutorialCategoryDto;
    const findCategory = await this.findCategory(category);
    if (findCategory) {
      throw new HttpException('category already exist', HttpStatus.BAD_REQUEST);
    }
    const createCat = this.categoryRepository.create({ Category: category });
    const saveCat = await this.categoryRepository.save(createCat);
    return {
      message: 'category successfully created',
      data: saveCat,
    };
  }

  async findAll() {
    return await this.findAllCategory();
  }

  async findOne(id: string) {
    const findCategory = await this.findCatId(id);
    if (!findCategory) {
      throw new HttpException('category does not exist', HttpStatus.NOT_FOUND);
    }
    return {
      data: findCategory,
    };
  }

  async update(
    id: string,
    updateTutorialCategoryDto: UpdateTutorialCategoryDto,
  ) {
    const { category } = updateTutorialCategoryDto;
    const findCategory = await this.findCatId(id);
    if (!findCategory) {
      throw new HttpException('category does not exist', HttpStatus.NOT_FOUND);
    }
    const updateCategory = await this.categoryRepository
      .createQueryBuilder()
      .update(TutorialCategory)
      .set({ Category: category })
      .where('id = :id', { id: id })
      .execute();

    if (updateCategory.affected >= 1) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedCategory = await this.findCatId(id);
      return updatedCategory;
    } else {
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    const category = await this.findCatId(id);

    if (!category) {
      throw new HttpException('category does not exist', HttpStatus.NOT_FOUND);
    }

    const removeCat = await this.categoryRepository.delete(id);
    return {
      message: 'category deleted',
      data: removeCat,
    };
  }
}
