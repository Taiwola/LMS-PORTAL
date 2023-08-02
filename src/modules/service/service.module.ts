import { Global, Module } from '@nestjs/common';
import { MailService } from './mailer/mailer.service';
import { UploadService } from './upload/upload.service';
import { GoogleService } from './google/google.service';

@Global()
@Module({
  providers: [MailService, UploadService, GoogleService],
  exports: [MailService, UploadService],
})
export class ServiceModule {}
