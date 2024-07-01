import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const nodemailer = require('nodemailer');

@Injectable()
export class EmailService {
  private transporter: { sendMail: (arg0: { from: string; to: string; subject: string; text: string; }) => any; };

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL'),
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
