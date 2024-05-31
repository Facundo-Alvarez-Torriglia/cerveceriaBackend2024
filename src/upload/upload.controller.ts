import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.uploadImage(file);
    return { imageUrl }; // Devolver la URL de la imagen en la respuesta
  }
}

