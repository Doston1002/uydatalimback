import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMS } from 'mongoose';
import { Section } from 'src/section/section.model';
import { User } from 'src/user/user.model';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ type: SchemaMS.Types.ObjectId, ref: 'User', index: true }) // ✅ LOW PRIORITY FIX: Index
  author: User;

  @Prop([{ type: SchemaMS.Types.ObjectId, ref: 'Section' }])
  sections: Section[];

  @Prop({ unique: true, required: true, index: true }) // ✅ LOW PRIORITY FIX: Index
  slug: string;

  @Prop({ type: Boolean, default: false, index: true }) // ✅ LOW PRIORITY FIX: Index
  isActive: boolean;

  @Prop([String])
  learn: string[];

  @Prop([String])
  requirements: string[];

  @Prop([String])
  tags: string[];

  @Prop()
  description: string;

  @Prop()
  level: string;

  @Prop({ index: true }) // ✅ LOW PRIORITY FIX: Index (filter uchun)
  category: string;

  @Prop()
  previewImage: string;

  @Prop()
  title: string;

  @Prop()
  exerpt: string;

  @Prop({ index: true }) // ✅ LOW PRIORITY FIX: Index (filter uchun)
  language: string;

  @Prop()
  updatedAt: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// ✅ LOW PRIORITY FIX: Compound indexes qo'shildi
CourseSchema.index({ category: 1, language: 1 }); // Category va language bo'yicha filter
CourseSchema.index({ author: 1, isActive: 1 }); // Instructor kurslarini filter
CourseSchema.index({ isActive: 1, language: 1 }); // Active kurslar filter
