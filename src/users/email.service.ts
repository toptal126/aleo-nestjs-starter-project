import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import FormData from 'form-data';

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}

  private MAILGUN_KEY = this.config.get<string>('MAILGUN_KEY');
  private MAILGUN_DOMAIN = this.config.get<string>('MAILGUN_DOMAIN');
  private client = new Mailgun(FormData).client({
    username: 'api',
    key: this.MAILGUN_KEY,
  });

  /**
   * Send via API
   * @param data
   */
  async sendMail(data: MailgunMessageData) {
    return await this.client.messages.create(this.MAILGUN_DOMAIN, data);
  }
}
