import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Param,
  Patch,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  signInUser,
  forgotPasswordInterface,
} from './interfaces/auth.interface';
import { Response, Request } from 'express';
import { GoogleOAuthGuard } from '../../common/guard/google.auth.guard';

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

  @Post('register/tutor')
  async createTutor(@Body() createAuthDto: CreateAuthDto) {
    await this.authService.createTutor(createAuthDto);
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

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req: Request) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }
}
