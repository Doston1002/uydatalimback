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
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @HttpCode(201)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createQuestion(@Request() req, @Body() createQuestionDto: CreateQuestionDto) {
    const userId = req.user._id;
    const question = await this.questionService.createQuestion(userId, createQuestionDto);
    return { message: 'Savol muvaffaqiyatli yuborildi', data: question };
  }

  @HttpCode(200)
  @Get('all')
  @Auth('ADMIN')
  async getAllQuestions(
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '1',
    @Query('status') status?: string,
  ) {
    return this.questionService.getAllQuestions(Number(limit), Number(page), status);
  }

  @HttpCode(200)
  @Get('my-questions')
  @UseGuards(JwtAuthGuard)
  async getUserQuestions(
    @Request() req,
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '1',
  ) {
    const userId = req.user._id;
    return this.questionService.getUserQuestions(userId, Number(limit), Number(page));
  }

  @HttpCode(200)
  @Get('unread-count')
  @Auth('ADMIN')
  async getUnreadCount() {
    const count = await this.questionService.getUnreadCount();
    return { unreadCount: count };
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getQuestion(@Param('id') id: string, @Request() req) {
    const userId = req.user._id;
    const question = await this.questionService.getQuestionById(id, userId);
    return { data: question };
  }

  @HttpCode(200)
  @Post('answer')
  @Auth('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async answerQuestion(@Request() req, @Body() answerQuestionDto: AnswerQuestionDto) {
    const adminId = req.user._id;
    const question = await this.questionService.answerQuestion(adminId, answerQuestionDto);
    return { message: 'Javob muvaffaqiyatli yuborildi', data: question };
  }

  @HttpCode(200)
  @Put(':id/read')
  @Auth('ADMIN')
  async markAsRead(@Param('id') id: string) {
    const question = await this.questionService.markAsRead(id);
    return { message: "O'qilgan deb belgilandi", data: question };
  }

  @HttpCode(200)
  @Put(':id/status')
  @Auth('ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'answered' | 'closed' },
  ) {
    const question = await this.questionService.updateStatus(id, body.status);
    return { message: 'Status yangilandi', data: question };
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth('ADMIN')
  async deleteQuestion(@Param('id') id: string) {
    return this.questionService.deleteQuestion(id);
  }
}
