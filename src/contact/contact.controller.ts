import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @HttpCode(200)
  @Post('send-message')
  async sendMessage(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactService.create(createContactDto);
    return { message: 'Message sent successfully', data: contact };
  }

  @HttpCode(200)
  @Get('messages')
  @Auth('ADMIN')
  async getMessages(
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '1',
    @Query('type') type?: 'contact' | 'attendance',
  ) {
    return this.contactService.findAll(Number(limit), Number(page), type);
  }

  @HttpCode(200)
  @Get('unread-count')
  @Auth('ADMIN')
  async getUnreadCount() {
    const count = await this.contactService.getUnreadCount();
    return { unreadCount: count };
  }

  @HttpCode(200)
  @Get(':id')
  @Auth('ADMIN')
  async getMessage(@Param('id') id: string) {
    const message = await this.contactService.findOne(id);
    if (!message) {
      throw new NotFoundException('Contact message not found');
    }
    return { message: 'Contact message retrieved', data: message };
  }

  @HttpCode(200)
  @Put(':id/read')
  @Auth('ADMIN')
  async markAsRead(@Param('id') id: string) {
    const message = await this.contactService.markAsRead(id);
    if (!message) {
      throw new NotFoundException('Contact message not found');
    }
    return { message: 'Contact message marked as read', data: message };
  }

  @HttpCode(200)
  @Put(':id/status')
  @Auth('ADMIN')
  async updateStatus(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    const message = await this.contactService.updateStatus(id, updateContactDto.status);
    if (!message) {
      throw new NotFoundException('Contact message not found');
    }
    return { message: 'Contact message status updated', data: message };
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth('ADMIN')
  async deleteMessage(@Param('id') id: string) {
    const message = await this.contactService.remove(id);
    if (!message) {
      throw new NotFoundException('Contact message not found');
    }
    return { message: 'Contact message deleted successfully' };
  }
}
