import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Course } from './entities/course.entity';
import { jwtConfig } from '../../config/jwt.config';
import { UserModule } from '../user/user.module';
import { TutorialModule } from '../tutorial/tutorial.module';

@Module({
  imports: [
    UserModule,
    TutorialModule,
    TypeOrmModule.forFeature([Course]),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
