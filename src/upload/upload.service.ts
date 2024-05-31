import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly imgbbApiKey = '4930413001740a11a5fce33bec7f52f9';

  constructor(private readonly httpService: HttpService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const imagePath = file.path;
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    try {
      const response = await lastValueFrom(
        this.httpService.post(`https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`, {
          image: base64Image,
        })
      );

      fs.unlinkSync(imagePath); // Eliminar el archivo temporal

      return response.data.data.url; // Devolver la URL de la imagen
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
