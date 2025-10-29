import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString({ message: "Ism-familiya matn bo'lishi kerak" })
  @IsNotEmpty({ message: "Ism-familiya bo'sh bo'lmasligi kerak" })
  @MinLength(3, { message: "Ism-familiya kamida 3 belgidan iborat bo'lishi kerak" })
  @MaxLength(100, { message: 'Ism-familiya 100 belgidan oshmasligi kerak' })
  fullName: string;

  @IsOptional()
  @IsString({ message: "Telefon raqam matn bo'lishi kerak" })
  phone?: string;

  @IsOptional()
  @IsString({ message: "Xabar matn bo'lishi kerak" })
  @MaxLength(1000, { message: 'Xabar 1000 belgidan oshmasligi kerak' })
  message?: string;

  // Attendance specific fields
  @IsOptional()
  @IsString()
  teacherName?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  schoolClass?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  teachingMethod?: string;

  @IsOptional()
  @IsBoolean()
  isAbsent?: boolean;

  @IsOptional()
  @IsIn(['contact', 'attendance'], { message: "Type faqat contact yoki attendance bo'lishi kerak" })
  type?: 'contact' | 'attendance';
}
