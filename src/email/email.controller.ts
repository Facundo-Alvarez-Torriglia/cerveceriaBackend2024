import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendConfirmationEmail(@Body() body, @Res() res: Response): Promise<void> {
    const { email, subject, message } = body;

    try {
      await this.emailService.sendEmail(email, subject, message);
      res.status(HttpStatus.OK).send({ message: 'Correo enviado con éxito' });
    } catch (error) {
      console.error('Error al enviar correo:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Error al enviar correo', error: error.message });
    }
  }
}
