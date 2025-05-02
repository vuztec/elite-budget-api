import { Injectable } from '@nestjs/common';
import { MessageResponse, PinpointClient, SendMessagesCommand } from '@aws-sdk/client-pinpoint';

@Injectable()
export class PinpointService {
  private pinClient: PinpointClient;

  constructor() {
    this.pinClient = new PinpointClient({
      region: process.env.PINPOINT_REGION,
      credentials: {
        accessKeyId: process.env.PINPOINT_ACCESS_KEY,
        secretAccessKey: process.env.PINPOINT_SECRET_ACCESS_KEY,
      },
    });
  }
  async sendEmail(email: string, html: string): Promise<MessageResponse> {
    // console.log('User : ', this.sms);
    const projectId = process.env.PINPOINT_PROJECT_ID;

    const fromAddress = `"Elite Cash Flow Products" <${process.env.PINPOINT_MAIL_USER}>`;

    // The subject line of the email.
    // The email body for recipients with non-HTML email clients.
    const body_text = `Confirmation otp`;

    // The body of the email for recipients whose email clients support HTML content.

    // The character encoding for the subject line and message body of the email.
    var charset = 'UTF-8';

    // addresses[ccAddress] = { ChannelType: 'EMAIL' };

    const params: any = {
      ApplicationId: projectId,
      MessageRequest: {
        Addresses: {
          [email]: {
            ChannelType: 'EMAIL',
          },
        },
        MessageConfiguration: {
          EmailMessage: {
            FromAddress: fromAddress,
            SimpleEmail: {
              Subject: {
                Charset: charset,
                Data: 'Confirmation OTP',
              },
              HtmlPart: {
                Charset: charset,
                Data: html,
              },
              TextPart: {
                Charset: charset,
                Data: body_text,
              },
            },
          },
        },
      },
    };

    try {
      const result = await this.pinClient.send(new SendMessagesCommand(params));

      return result.MessageResponse;
    } catch (error) {
      console.error('Error sending Email:', error);
      throw new Error('Failed to send Email');
    }
  }
}
