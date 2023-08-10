import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TutorialCategoryService } from './tutorial-category.service';
import { CreateTutorialCategoryDto } from './dto/create-tutorial-category.dto';
import { UpdateTutorialCategoryDto } from './dto/update-tutorial-category.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/auth.decorator';
import { UserRoles } from '../user/entities/user.entity';

@Controller('tutorial-category')
export class TutorialCategoryController {
  constructor(
    private readonly tutorialCategoryService: TutorialCategoryService,
  ) {}

  @Post('create')
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
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
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateTutorialCategoryDto: UpdateTutorialCategoryDto,
  ) {
    return this.tutorialCategoryService.update(id, updateTutorialCategoryDto);
  }

  @Delete('delete/:id')
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.tutorialCategoryService.remove(id);
  }
}
