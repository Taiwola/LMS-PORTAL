import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Request } from 'express';
import { Roles } from '../auth/decorators/auth.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(UserRoles.ADMIN, UserRoles.USER, UserRoles.tutor)
  @UseGuards(RolesGuard)
  @Post('add/:id')
  create(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.courseService.create(id, req);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER, UserRoles.tutor)
  @UseGuards(RolesGuard)
  @Get('all')
  findAll(@Req() req: Request) {
    return this.courseService.findAll(req);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER, UserRoles.tutor)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
