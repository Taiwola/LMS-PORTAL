import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../interfaces/auth.interface';
import { Request } from 'express';

@Injectable()
export class IsBlockedGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('in the isblocked guard');

    if (!token) {
      return true;
    }
    const payload = this.jwtService.decode(token) as JwtPayload;
    const user = await this.userService.checkUserById(payload.id);

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    if (user.isBlocked === true) {
      return false;
    } else {
      return true;
    }
  }

  private extractTokenFromHeader(request: Request) {
    const token = request?.headers?.authorization?.split(' ')[1];
    return token;
  }
}
