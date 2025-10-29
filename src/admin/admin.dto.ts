import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  Matches,
  IsMongoId,
} from 'class-validator';

export class ApproveInstructorDto {
  @IsNotEmpty()
  @IsMongoId()
  instructorId: string;
}

export class DeleteCourseDto {
  @IsNotEmpty()
  @IsMongoId()
  courseId: string;
}

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsEnum(['ADMIN', 'INSTRUCTOR', 'USER'])
  role: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email kiritilishi shart' })
  @IsEmail({}, { message: "Noto'g'ri email format" })
  email: string;

  @IsNotEmpty({ message: 'Ism kiritilishi shart' })
  @IsString()
  @MinLength(3, { message: "Ism kamida 3 ta belgidan iborat bo'lishi kerak" })
  fullName: string;

  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  @IsString()
  @MinLength(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Parol katta harf, kichik harf, raqam va maxsus belgi (@$!%*?&) dan iborat bo'lishi kerak",
  })
  password: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'INSTRUCTOR', 'USER'])
  role?: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Foydalanuvchi ID kiritilishi shart' })
  @IsMongoId({ message: "Noto'g'ri foydalanuvchi ID" })
  userId: string;

  @IsOptional()
  @IsEmail({}, { message: "Noto'g'ri email format" })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Ism kamida 3 ta belgidan iborat bo'lishi kerak" })
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Parol katta harf, kichik harf, raqam va maxsus belgi (@$!%*?&) dan iborat bo'lishi kerak",
  })
  password?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'INSTRUCTOR', 'USER'])
  role?: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}

export class DeleteUserDto {
  @IsNotEmpty({ message: 'Foydalanuvchi ID kiritilishi shart' })
  @IsMongoId({ message: "Noto'g'ri foydalanuvchi ID" })
  userId: string;
}
