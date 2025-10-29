import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // ✅ SECURITY FIX: Password validation - xavfsiz parol talablari
  @IsString()
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" })
  @MinLength(8, { message: "Parol kamida 8 belgidan iborat bo'lishi kerak" })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: "Parol kamida 1 harf va 1 raqamdan iborat bo'lishi kerak. Masalan: mypass123",
  })
  password: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
