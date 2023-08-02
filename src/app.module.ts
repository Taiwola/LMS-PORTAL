import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { typeormConfigAsync } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UploadService } from './modules/service/upload/upload.service';
import { MailService } from './modules/service/mailer/mailer.service';
import { ServiceModule } from './modules/service/service.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { GoogleService } from './modules/service/google/google.service';

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
  ],
  controllers: [AppController],
  providers: [AppService, UploadService, MailService, GoogleService],
})
export class AppModule {}
