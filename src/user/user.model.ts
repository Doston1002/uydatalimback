import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMS } from 'mongoose';
import { Course } from 'src/course/course.model';
import { RoleUser } from './user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop()
  fullName: string;

  @Prop()
  password: string;

  @Prop({ default: 'USER' })
  role: RoleUser;

  @Prop()
  avatar: string;

  @Prop()
  job: string;

  @Prop({ index: true }) // ✅ LOW PRIORITY FIX: Index qo'shildi
  customerId: string;

  @Prop({ index: true }) // ✅ LOW PRIORITY FIX: Index qo'shildi (OneID uchun)
  pin: string;

  @Prop({ index: true }) // ✅ LOW PRIORITY FIX: Index qo'shildi (Instructor uchun)
  instructorAccountId: string;

  @Prop()
  createdAt: string;

  @Prop()
  bio: string;

  @Prop()
  birthday: string;

  @Prop([{ type: SchemaMS.Types.ObjectId, ref: 'Course' }])
  courses: Course[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// ✅ LOW PRIORITY FIX: Compound index qo'shildi (email + role)
UserSchema.index({ email: 1, role: 1 });
