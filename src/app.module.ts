import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { typeormConfigAsync } from './config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UploadService } from './modules/service/upload/upload.service';
import { MailService } from './modules/service/mailer/mailer.service';
import { ServiceModule } from './modules/service/service.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { GoogleService } from './modules/service/google/google.service';
import { TutorialModule } from './modules/tutorial/tutorial.module';
import { TutorialCategoryModule } from './modules/tutorial-category/tutorial-category.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { Cloudinary } from './config/cloudinary/cloudinary';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use TLS
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.APP_PASS,
        },
      },
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    JwtModule.registerAsync(jwtConfig),
    ServiceModule,
    TutorialModule,
    TutorialCategoryModule,
    LessonModule,
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
  controllers: [AppController],
  providers: [
    AppService,
    UploadService,
    MailService,
    GoogleService,
    Cloudinary,
  ],
})
export class AppModule {}
