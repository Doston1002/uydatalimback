import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  phone: string;

  @Prop()
  message: string;

  // Attendance specific fields
  @Prop()
  teacherName: string;

  @Prop()
  region: string;

  @Prop()
  district: string;

  @Prop()
  school: string;

  @Prop()
  schoolClass: string;

  @Prop()
  subject: string;

  @Prop()
  teachingMethod: string;

  @Prop({ default: false })
  isAbsent: boolean;

  @Prop({ default: 'contact' })
  type: 'contact' | 'attendance';

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: 'pending' })
  status: 'pending' | 'replied' | 'closed';

  // Explicitly define timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
