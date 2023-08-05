import { Test, TestingModule } from '@nestjs/testing';
import { TutorialCategoryService } from './tutorial-category.service';

describe('TutorialCategoryService', () => {
  let service: TutorialCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutorialCategoryService],
    }).compile();

    service = module.get<TutorialCategoryService>(TutorialCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
