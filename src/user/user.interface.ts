import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsIn,
  IsMongoId,
  MaxLength,
} from 'class-validator';
import { UserDocument } from './user.model';

export type RoleUser = 'ADMIN' | 'INSTRUCTOR' | 'USER';
export type UserTypeData = keyof UserDocument;

// ✅ SECURITY FIX: Interface ni Class DTO ga o'zgartirdik validation uchun
export class InterfaceEmailAndPassword {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // ✅ SECURITY FIX: Xavfsiz parol talablari
  @IsString()
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" })
  @MinLength(8, { message: "Parol kamida 8 belgidan iborat bo'lishi kerak" })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: "Parol kamida 1 harf va 1 raqamdan iborat bo'lishi kerak. Masalan: mypass123",
  })
  password: string;
}

// ✅ LOW PRIORITY FIX: UpdateUserDto validation qo'shildi
export class UpdateUserDto {
  @IsOptional() // ✅ Optional - faqat kerakli fieldlarni update qilish mumkin
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsOptional() // ✅ Optional - faqat kerakli fieldlarni update qilish mumkin
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  birthday: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  job: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio: string;

  @IsOptional()
  @IsString()
  avatar: string;
}

// ✅ LOW PRIORITY FIX: ChangeRoleDto validation qo'shildi
export class ChangeRoleDto {
  @IsMongoId({ message: "User ID noto'g'ri formatda" })
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ADMIN', 'INSTRUCTOR', 'USER'], {
    message: "Role faqat ADMIN, INSTRUCTOR yoki USER bo'lishi mumkin",
  })
  role: RoleUser;
}
