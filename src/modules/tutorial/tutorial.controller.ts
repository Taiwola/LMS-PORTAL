import {
  Controller,
  Delete,
  Post,
  Body,
  Param,
  Get,
  Req,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { Request, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { TutorialService } from './tutorial.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { Roles } from '../auth/decorators/auth.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guard/roles.guard';
import { TutorialInterface } from './interfaces/tutorial.interfaces';

@Controller('tutorial')
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  @Post('create')
  @Roles(UserRoles.ADMIN, UserRoles.tutor)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createTut: CreateTutorialDto,
    @Req() req: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.tutorialService.create(createTut, req, image);
  }

  @Patch('update/:id')
  @Roles(UserRoles.ADMIN, UserRoles.tutor)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTut: UpdateTutorialDto,
    @Req() req: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.tutorialService.updateTutorial(id, updateTut, req, image);
  }

  @Get('all')
  async findAll() {
    return await this.tutorialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tutorialService.findOne(id);
  }

  @Patch('change/category/:id')
  @Roles(UserRoles.ADMIN, UserRoles.tutor)
  @UseGuards(RolesGuard)
  async changeCat(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Body() updateTut: UpdateTutorialDto,
  ) {
    return await this.tutorialService.changeCategory(id, updateTut, req);
  }

  @Patch('remove/keywords/:id')
  @Roles(UserRoles.ADMIN, UserRoles.tutor)
  @UseGuards(RolesGuard)
  async removeKeywords(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() keywords: TutorialInterface,
  ) {
    return await this.tutorialService.removeKeywords(id, keywords);
  }

  @Delete('delete/:id')
  @Roles(UserRoles.ADMIN, UserRoles.tutor)
  @UseGuards(RolesGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return await this.tutorialService.remove(id, req);
  }
}
