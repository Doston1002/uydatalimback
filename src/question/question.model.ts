import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.model';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  answer: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  answeredBy: User;

  @Prop()
  answeredAt: Date;

  @Prop({ default: 'pending' })
  status: 'pending' | 'answered' | 'closed';

  @Prop({ default: false })
  isRead: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
