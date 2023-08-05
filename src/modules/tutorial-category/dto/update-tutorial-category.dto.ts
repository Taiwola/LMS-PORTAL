import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorialCategoryDto } from './create-tutorial-category.dto';

export class UpdateTutorialCategoryDto extends PartialType(CreateTutorialCategoryDto) {}
