import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TutorialCategoryService } from './tutorial-category.service';
import { CreateTutorialCategoryDto } from './dto/create-tutorial-category.dto';
import { UpdateTutorialCategoryDto } from './dto/update-tutorial-category.dto';

@Controller('tutorial-category')
export class TutorialCategoryController {
  constructor(
    private readonly tutorialCategoryService: TutorialCategoryService,
  ) {}

  @Post('create')
  create(@Body() createTutorialCategoryDto: CreateTutorialCategoryDto) {
    return this.tutorialCategoryService.create(createTutorialCategoryDto);
  }

  @Get('all')
  findAll() {
    return this.tutorialCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorialCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTutorialCategoryDto: UpdateTutorialCategoryDto,
  ) {
    return this.tutorialCategoryService.update(id, updateTutorialCategoryDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.tutorialCategoryService.remove(id);
  }
}
