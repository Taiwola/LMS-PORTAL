import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { jwtConfig } from '../../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TutorialModule } from '../tutorial/tutorial.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    JwtModule.registerAsync(jwtConfig),
    TutorialModule,
    UserModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
