import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'Mavzu kiritilishi shart' })
  @IsString()
  @MinLength(3, { message: "Mavzu kamida 3 ta belgidan iborat bo'lishi kerak" })
  title: string;

  @IsNotEmpty({ message: 'Savol kiritilishi shart' })
  @IsString()
  @MinLength(10, { message: "Savol kamida 10 ta belgidan iborat bo'lishi kerak" })
  description: string;
}
