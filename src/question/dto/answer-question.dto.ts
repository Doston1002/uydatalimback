import { IsNotEmpty, IsString, MinLength, IsMongoId } from 'class-validator';

export class AnswerQuestionDto {
  @IsNotEmpty({ message: 'Savol ID kiritilishi shart' })
  @IsMongoId({ message: "Noto'g'ri savol ID" })
  questionId: string;

  @IsNotEmpty({ message: 'Javob kiritilishi shart' })
  @IsString()
  @MinLength(10, { message: "Javob kamida 10 ta belgidan iborat bo'lishi kerak" })
  answer: string;
}
