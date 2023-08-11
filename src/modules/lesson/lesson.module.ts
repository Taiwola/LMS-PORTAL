import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { jwtConfig } from '../../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TutorialModule } from '../tutorial/tutorial.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    JwtModule.registerAsync(jwtConfig),
    TutorialModule,
    UserModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: async (configService: ConfigService) => ({
        dest: process.env.MULTER_DEST,
        storage: diskStorage({
          destination: process.env.MULTER_DEST,
          filename(req, file, callback) {
            const randomName = Array(32)
              .fill(null)
              .map(() => {
                const randomChar = Math.floor(Math.random() * 26) + 97;
                return String.fromCharCode(randomChar);
              })
              .join('');
            const extension = file.originalname.split('.').pop();
            const finalFileName = randomName + '.' + extension;
            callback(null, finalFileName);
          },
        }),
      }),
    }),
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
