import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: "Kitob nomi bo'sh bo'lmasligi kerak" })
  @MinLength(3, { message: "Kitob nomi kamida 3 belgidan iborat bo'lishi kerak" })
  @MaxLength(200, { message: 'Kitob nomi 200 belgidan oshmasligi kerak' })
  title: string;

  @IsOptional() // ✅ Rasm ixtiyoriy (faqat PDF yuklanadi)
  @IsString({ message: "Rasm matn ko'rinishida bo'lishi kerak" })
  image?: string;

  @IsString()
  @IsNotEmpty({ message: "PDF fayl bo'sh bo'lmasligi kerak" })
  pdf: string;

  @IsString()
  @IsNotEmpty({ message: "Kategoriya bo'sh bo'lmasligi kerak" })
  category: string;
}
