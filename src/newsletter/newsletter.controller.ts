// back/src/newsletter/newsletter.controller.ts
import { Body, Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() body: { email: string }) {
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return {
        success: false,
        error: 'Email talab qilinadi',
      };
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return {
        success: false,
        error: "Email bo'sh bo'lishi mumkin emas",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        success: false,
        error: "Email noto'g'ri formatda",
      };
    }

    try {
      await this.newsletterService.subscribe(trimmedEmail);
      return {
        success: true,
        message: 'Obunaga rahmat!',
        email: trimmedEmail,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Serverda xato yuz berdi',
      };
    }
  }

  @Get('subscribers')
  async getAllSubscribers() {
    try {
      const subscribers = await this.newsletterService.getAllSubscribers();
      return {
        success: true,
        data: subscribers,
      };
    } catch (error) {
      return {
        success: false,
        error: "Ma'lumotlarni olishda xato",
      };
    }
  }
}
