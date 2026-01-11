import { Injectable, Logger } from '@nestjs/common';
import { PinpointService } from '@/pinpoint/pinpoint.service';
import {
  CustomerServicePayload,
  customerServiceEmailHtml,
  customerServiceEmailSubject,
} from '@/pinpoint/templates/customer-service';
import { CustomerServiceDto } from './dto/customer-service.dto';

@Injectable()
export class CustomerServiceService {
  private readonly logger = new Logger(CustomerServiceService.name);
  private readonly adminEmail = 'info@elitecashflowproducts.com';

  constructor(private readonly pinpointService: PinpointService) {}

  /**
   * Handle customer service form submission
   * Sends an email notification to the admin
   */
  async submitCustomerService(dto: CustomerServiceDto): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`Processing customer service request from ${dto.email}`);

      // Prepare email payload
      const payload: CustomerServicePayload = {
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
        recaptchaToken: dto.recaptchaToken,
        source: dto.source || 'Customer Service Dialog',
        createdAt: new Date(),
      };

      // Generate email HTML and subject
      const emailHtml = customerServiceEmailHtml(payload);
      const emailSubject = customerServiceEmailSubject(payload);
      const emailText = `New customer service request from ${dto.name} (${dto.email}): ${dto.subject}`;

      // Send email to admin
      await this.pinpointService.sendEmail(this.adminEmail, emailHtml, emailSubject, emailText);

      this.logger.log(`✅ Customer service email sent to admin: ${this.adminEmail}`);

      return {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon.',
      };
    } catch (error) {
      this.logger.error('❌ Error sending customer service email:', error);
      throw error;
    }
  }
}
