import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  MinLength,
  MaxLength,
  IsIn,
  IsOptional,
} from 'class-validator';

// ✅ LOW PRIORITY FIX: CourseBodyDto validation qo'shildi
export class CourseBodyDto {
  @IsString()
  @IsNotEmpty({ message: "Kurs nomi bo'sh bo'lmasligi kerak" })
  @MinLength(5, { message: "Kurs nomi kamida 5 belgidan iborat bo'lishi kerak" })
  @MaxLength(200, { message: 'Kurs nomi 200 belgidan oshmasligi kerak' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: "Qisqacha tavsif bo'sh bo'lmasligi kerak" })
  @MinLength(10, { message: "Qisqacha tavsif kamida 10 belgidan iborat bo'lishi kerak" })
  @MaxLength(500, { message: 'Qisqacha tavsif 500 belgidan oshmasligi kerak' })
  exerpt: string;

  @IsArray({ message: "O'rganish natijalari array bo'lishi kerak" })
  @ArrayMinSize(1, { message: "Kamida 1 ta o'rganish natijasi bo'lishi kerak" })
  @IsString({ each: true, message: "Har bir element string bo'lishi kerak" })
  learn: string[];

  @IsArray({ message: "Talablar array bo'lishi kerak" })
  @ArrayMinSize(1, { message: "Kamida 1 ta talab bo'lishi kerak" })
  @IsString({ each: true })
  requirements: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsNotEmpty({ message: "Tavsif bo'sh bo'lmasligi kerak" })
  @MinLength(20, { message: "Tavsif kamida 20 belgidan iborat bo'lishi kerak" })
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Beginner', 'Intermediate', 'Advanced', 'All levels'], {
    message: "Level faqat Beginner, Intermediate, Advanced yoki All levels bo'lishi mumkin",
  })
  level: string;

  @IsString()
  @IsNotEmpty({ message: "Kategoriya bo'sh bo'lmasligi kerak" })
  category: string;
}
