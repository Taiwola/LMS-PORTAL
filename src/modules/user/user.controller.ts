import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/auth.decorator';
import { UserRoles } from './entities/user.entity';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('create/admin/:id')
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  async createAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.addAdmin(id);
  }

  @Get('all')
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch('add/admin/:id')
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  async addAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.addAdmin(id);
  }

  @Patch('block/:id')
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  async blockAccount(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.blockUser(id);
  }

  @Patch('unblock/:id')
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  async unBlockAccount(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.unBlockUser(id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.userService.update(id, updateUserDto, req);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.userService.remove(id, req);
  }
}
