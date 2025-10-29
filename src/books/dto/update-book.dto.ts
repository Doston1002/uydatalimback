import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Kitob nomi kamida 3 belgidan iborat bo'lishi kerak" })
  @MaxLength(200, { message: 'Kitob nomi 200 belgidan oshmasligi kerak' })
  title?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  pdf?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
