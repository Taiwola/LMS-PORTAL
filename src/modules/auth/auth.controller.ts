import { Controller, Post, Body, Res, Req, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  signInUser,
  forgotPasswordInterface,
} from './interfaces/auth.interface';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.createUser(createAuthDto);
  }

  @Post('register/admin')
  async createAdmin(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.createAdmin(createAuthDto);
  }

  @Post('signin')
  async signin(
    @Body() signin: signInUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.signinUser(signin, res);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPwd: forgotPasswordInterface) {
    return await this.authService.forgotPassword(forgotPwd);
  }

  @Patch('reset/:token')
  async resetPwd(
    @Param('token') token: string,
    @Body() reset: forgotPasswordInterface,
  ) {
    return await this.authService.resetPassword(token, reset);
  }

  @Post('logout')
  async logoutUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logoutUser(req, res);
  }
}
