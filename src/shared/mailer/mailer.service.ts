import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailerService {
  //private readonly transporter: Transporter;
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // Brevo SMTP user
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async send({ to, subject, html }: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Rivva" <${process.env.MAIL_FROM}>`,
        to: to,
        subject: subject,
        html: html,
      });
    } catch (error) {
      this.logger.error('Email send failed', error);
      throw error;
    }
  }
}
