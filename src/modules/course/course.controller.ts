import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Request } from 'express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('add/:id')
  create(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.courseService.create(id, req);
  }

  @Get('all')
  findAll(@Req() req: Request) {
    return this.courseService.findAll(req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
