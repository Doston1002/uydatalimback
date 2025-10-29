import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './question.model';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private questionModel: Model<QuestionDocument>) {}

  async createQuestion(userId: string, createQuestionDto: CreateQuestionDto) {
    const question = new this.questionModel({
      user: userId,
      title: createQuestionDto.title,
      description: createQuestionDto.description,
      status: 'pending',
    });

    const savedQuestion = await question.save();
    return this.transformQuestion(await savedQuestion.populate('user', 'fullName email'));
  }

  async getAllQuestions(limit: number = 10, page: number = 1, status?: string) {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (status && ['pending', 'answered', 'closed'].includes(status)) {
      filter.status = status;
    }

    const questions = await this.questionModel
      .find(filter)
      .populate('user', 'fullName email')
      .populate('answeredBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await this.questionModel.countDocuments(filter);

    return {
      questions: questions.map(q => this.transformQuestion(q)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserQuestions(userId: string, limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    const questions = await this.questionModel
      .find({ user: userId })
      .populate('user', 'fullName email')
      .populate('answeredBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await this.questionModel.countDocuments({ user: userId });

    return {
      questions: questions.map(q => this.transformQuestion(q)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getQuestionById(id: string, userId?: string) {
    const question = await this.questionModel
      .findById(id)
      .populate('user', 'fullName email')
      .populate('answeredBy', 'fullName email')
      .exec();

    if (!question) {
      throw new NotFoundException('Savol topilmadi');
    }

    // Foydalanuvchi faqat o'z savolini ko'ra oladi (admin emas bo'lsa)
    if (userId && question.user && (question.user as any)._id.toString() !== userId) {
      throw new NotFoundException('Savol topilmadi');
    }

    return this.transformQuestion(question);
  }

  async answerQuestion(adminId: string, answerQuestionDto: AnswerQuestionDto) {
    const question = await this.questionModel.findById(answerQuestionDto.questionId);

    if (!question) {
      throw new NotFoundException('Savol topilmadi');
    }

    question.answer = answerQuestionDto.answer;
    question.answeredBy = adminId as any;
    question.answeredAt = new Date();
    question.status = 'answered';

    const savedQuestion = await question.save();
    return this.transformQuestion(await savedQuestion.populate(['user', 'answeredBy']));
  }

  async markAsRead(id: string) {
    const question = await this.questionModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .populate('user', 'fullName email')
      .populate('answeredBy', 'fullName email')
      .exec();

    if (!question) {
      throw new NotFoundException('Savol topilmadi');
    }

    return this.transformQuestion(question);
  }

  async updateStatus(id: string, status: 'pending' | 'answered' | 'closed') {
    const question = await this.questionModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('user', 'fullName email')
      .populate('answeredBy', 'fullName email')
      .exec();

    if (!question) {
      throw new NotFoundException('Savol topilmadi');
    }

    return this.transformQuestion(question);
  }

  async deleteQuestion(id: string) {
    const question = await this.questionModel.findByIdAndDelete(id).exec();

    if (!question) {
      throw new NotFoundException('Savol topilmadi');
    }

    return { message: "Savol o'chirildi" };
  }

  async getUnreadCount() {
    return this.questionModel.countDocuments({ isRead: false, status: 'pending' });
  }

  private transformQuestion(question: QuestionDocument) {
    return {
      id: question._id.toString(),
      user: question.user
        ? {
            id: (question.user as any)._id?.toString(),
            fullName: (question.user as any).fullName,
            email: (question.user as any).email,
          }
        : null,
      title: question.title,
      description: question.description,
      answer: question.answer,
      answeredBy: question.answeredBy
        ? {
            id: (question.answeredBy as any)._id?.toString(),
            fullName: (question.answeredBy as any).fullName,
            email: (question.answeredBy as any).email,
          }
        : null,
      answeredAt: question.answeredAt,
      status: question.status,
      isRead: question.isRead,
      createdAt: question.createdAt || new Date(),
      updatedAt: question.updatedAt || new Date(),
    };
  }
}
