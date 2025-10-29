import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.model';

export type UserActivityDocument = HydratedDocument<UserActivity>;

@Schema({ timestamps: true })
export class UserActivity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  user: User;

  @Prop()
  userId: string;

  @Prop()
  userEmail: string;

  @Prop()
  userName: string;

  @Prop({ required: true })
  action: string; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW, DOWNLOAD, etc.

  @Prop({ required: true })
  entity: string; // course, book, user, question, etc.

  @Prop()
  entityId: string;

  @Prop()
  method: string; // GET, POST, PUT, DELETE

  @Prop()
  url: string;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop({ type: Object })
  requestBody: any;

  @Prop({ type: Object })
  responseData: any;

  @Prop()
  statusCode: number;

  @Prop()
  errorMessage: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);

// Index'lar qo'shish - tezroq qidiruv uchun
UserActivitySchema.index({ userId: 1, timestamp: -1 });
UserActivitySchema.index({ action: 1, entity: 1 });
UserActivitySchema.index({ timestamp: -1 });
