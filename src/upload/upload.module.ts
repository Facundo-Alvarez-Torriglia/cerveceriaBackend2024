import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    HttpModule, 
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
