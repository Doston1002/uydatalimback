// back/src/newsletter/newsletter.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { Newsletter, NewsletterSchema } from './newsletter.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Newsletter.name, schema: NewsletterSchema }])],
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterModule {}
