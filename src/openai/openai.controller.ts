import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateChatCompletionRequest } from './dto/create-chat-completion.request';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chatCompletion')
  async createChatCompletion(@Body() body: CreateChatCompletionRequest) {
    try {
      return await this.openaiService.createChatCompletion(body.messages);
    } catch (error) {
      throw new HttpException(
        'AI xizmatida muammo yuz berdi: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
