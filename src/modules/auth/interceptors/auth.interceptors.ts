import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private jwt: JwtService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request?.headers?.authorization;
    const token = authorizationHeader?.split(' ')[1];

    if (token) {
      const decoded = this.jwt.decode(token) as JwtPayload;
      request.user = decoded;
    }

    return next.handle();
  }
}
