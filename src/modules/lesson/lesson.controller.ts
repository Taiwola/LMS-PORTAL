import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { Express, Request } from 'express';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('add/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 6 },
      { name: 'video', maxCount: 1 },
      { name: 'document', maxCount: 1 },
    ]),
  )
  create(
    @Body() createLessonDto: CreateLessonDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    files: {
      image: Express.Multer.File[];
      images: Express.Multer.File[];
      video: Express.Multer.File[];
      document: Express.Multer.File[];
    },
  ) {
    const video = files.video ? files.video[0] : null;
    const image = files.image ? files.image[0] : null;
    const document = files.document ? files.document[0] : null;
    const images = files.images
      ? files.images.map((image) => {
          return image;
        })
      : null;
    return this.lessonService.create(
      id,
      createLessonDto,
      req,
      image,
      images,
      video,
      document,
    );
  }

  @Get('all')
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 6 },
      { name: 'video', maxCount: 1 },
      { name: 'document', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @Req() req: Request,
    @UploadedFiles()
    files: {
      image: Express.Multer.File[];
      images: Express.Multer.File[];
      video: Express.Multer.File[];
      document: Express.Multer.File[];
    },
  ) {
    const video = files.video ? files.video[0] : null;
    const image = files.image ? files.image[0] : null;
    const document = files.document ? files.document[0] : null;
    const images = files.images
      ? files.images.map((image) => {
          return image;
        })
      : null;
    return this.lessonService.update(
      id,
      updateLessonDto,
      req,
      image,
      images,
      video,
      document,
    );
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.lessonService.remove(id, req);
  }
}
