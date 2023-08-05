import { Global, Module } from '@nestjs/common';
import { MailService } from './mailer/mailer.service';
import { UploadService } from './upload/upload.service';
import { GoogleService } from './google/google.service';
import { cloudinaryProvider } from '../../config/cloudinary.config';

@Global()
@Module({
  providers: [MailService, UploadService, GoogleService, cloudinaryProvider],
  exports: [MailService, UploadService],
})
export class ServiceModule {}
