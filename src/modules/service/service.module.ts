import { Global, Module } from '@nestjs/common';
import { MailService } from './mailer/mailer.service';
import { UploadService } from './upload/upload.service';

@Global()
@Module({
  providers: [MailService, UploadService],
  exports: [MailService, UploadService],
})
export class ServiceModule {}
