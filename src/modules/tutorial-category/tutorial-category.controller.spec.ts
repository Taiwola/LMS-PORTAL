import { Test, TestingModule } from '@nestjs/testing';
import { TutorialCategoryController } from './tutorial-category.controller';
import { TutorialCategoryService } from './tutorial-category.service';

describe('TutorialCategoryController', () => {
  let controller: TutorialCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorialCategoryController],
      providers: [TutorialCategoryService],
    }).compile();

    controller = module.get<TutorialCategoryController>(TutorialCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
