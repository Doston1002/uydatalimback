// back/src/newsletter/newsletter.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Newsletter } from './newsletter.model';

@Injectable()
export class NewsletterService {
  constructor(@InjectModel(Newsletter.name) private newsletterModel: Model<Newsletter>) {}

  async subscribe(email: string) {
    try {
      // Email mavjudligini tekshirish
      const existingSubscriber = await this.newsletterModel.findOne({ email });

      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          throw new Error("Bu email allaqachon obuna bo'lgan");
        } else {
          // Qayta faollashtirish
          existingSubscriber.isActive = true;
          existingSubscriber.subscribedAt = new Date();
          return await existingSubscriber.save();
        }
      }

      // Yangi obuna
      const subscriber = new this.newsletterModel({
        email,
        isActive: true,
        subscribedAt: new Date(),
      });

      return await subscriber.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllSubscribers() {
    return await this.newsletterModel.find({ isActive: true }).exec();
  }

  async unsubscribe(email: string) {
    return await this.newsletterModel.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true },
    );
  }
}
