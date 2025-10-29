// import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectModel } from '@nestjs/mongoose';
// import { compare, genSalt, hash } from 'bcryptjs';
// import { Model } from 'mongoose';
// import { CustomerService } from 'src/customer/customer.service';
// import { User, UserDocument } from 'src/user/user.model';
// import { LoginAuthDto } from './dto/login.dto';
// import { TokenDto } from './dto/token.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//     private readonly jwtService: JwtService,
//     private readonly customerService: CustomerService,
//   ) {}

//   async register(dto: LoginAuthDto) {
//     const existUser = await this.isExistUser(dto.email);
//     if (existUser) throw new BadRequestException('already_exist');

//     const salt = await genSalt(10);
//     const passwordHash = await hash(dto.password, salt);

//     const newUser = await this.userModel.create({
//       ...dto,
//       password: dto.password.length ? passwordHash : '',
//     });

//     await this.customerService.getCustomer(String(newUser._id));
//     const token = await this.issueTokenPair(String(newUser._id));

//     return { user: this.getUserField(newUser), ...token };
//   }

//   async login(dto: LoginAuthDto) {
//     const existUser = await this.isExistUser(dto.email);
//     if (!existUser) throw new BadRequestException('user_not_found');

//     if (dto.password.length) {
//       const currentPassword = await compare(dto.password, existUser.password);
//       if (!currentPassword) throw new BadRequestException('incorrect_password');
//     }

//     await this.customerService.getCustomer(String(existUser._id));
//     const token = await this.issueTokenPair(String(existUser._id));
//     return { user: this.getUserField(existUser), ...token };
//   }

//   async getNewTokens({ refreshToken }: TokenDto) {
//     if (!refreshToken) throw new UnauthorizedException('Please sign in!');

//     const result = await this.jwtService.verifyAsync(refreshToken);

//     if (!result) throw new UnauthorizedException('Invalid token or expired!');

//     const user = await this.userModel.findById(result._id);

//     const token = await this.issueTokenPair(String(user._id));
//     return { user: this.getUserField(user), ...token };
//   }

//   async checkUser(email: string) {
//     const user = await this.isExistUser(email);

//     if (user) {
//       return 'user';
//     } else {
//       return 'no-user';
//     }
//   }

//   async isExistUser(email: string): Promise<UserDocument> {
//     const existUser = await this.userModel.findOne({ email });
//     return existUser;
//   }

//   async issueTokenPair(userId: string) {
//     const data = { _id: userId };

//     const refreshToken = await this.jwtService.signAsync(data, { expiresIn: '15d' });

//     const accessToken = await this.jwtService.signAsync(data, { expiresIn: '1m' });

//     return { refreshToken, accessToken };
//   }

//   getUserField(user: UserDocument) {
//     return {
//       id: user._id,
//       email: user.email,
//       fullName: user.fullName,
//       avatar: user.avatar,
//       role: user.role,
//       courses: user.courses,
//       createdAt: user.createdAt,
//       birthday: user.birthday,
//       bio: user.bio,
//       job: user.job,
//     };
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { JwtService } from '@nestjs/jwt';
// import { User } from './schemas/user.schema';
// import { OneIdUserData } from './oneid.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<User>,
//     private jwtService: JwtService,
//   ) {}

//   async processOneIdUser(oneIdData: OneIdUserData) {
//     try {
//       // OneID ma'lumotlarini User modeliga moslashtirish
//       const mappedUserData = this.mapOneIdToUser(oneIdData);

//       // PIN yoki user_id orqali mavjud foydalanuvchini qidirish
//       let user = await this.userModel.findOne({
//         $or: [
//           { customerId: oneIdData.pin }, // PIN ni customerId sifatida saqlash
//           { email: `${oneIdData.user_id}@oneid.uz` }, // OneID user_id dan email yasash
//         ],
//       });

//       if (!user) {
//         // Yangi foydalanuvchi yaratish
//         user = new this.userModel(mappedUserData);
//         await user.save();
//       } else {
//         // Mavjud foydalanuvchini yangilash
//         Object.assign(user, mappedUserData);
//         await user.save();
//       }

//       // JWT token generatsiya qilish
//       const payload = {
//         sub: user._id,
//         email: user.email,
//         role: user.role
//       };
//       const token = this.jwtService.sign(payload);

//       return {
//         token,
//         user: {
//           id: user._id,
//           email: user.email,
//           fullName: user.fullName,
//           role: user.role,
//           customerId: user.customerId,
//         },
//       };
//     } catch (error) {
//       console.error('Process OneID user error:', error);
//       throw error;
//     }
//   }

//   private mapOneIdToUser(oneIdData: OneIdUserData): Partial<User> {
//     // Birth date ni to'g'ri formatga o'tkazish (YYYYMMDD -> YYYY-MM-DD)
//     const birthDate = oneIdData.birth_date
//       ? `${oneIdData.birth_date.slice(0, 4)}-${oneIdData.birth_date.slice(4, 6)}-${oneIdData.birth_date.slice(6, 8)}`
//       : '';

//     return {
//       // OneID user_id dan email yaratish (yoki boshqa mantiq qo'llash mumkin)
//       email: `${oneIdData.user_id}@oneid.uz`,
//       fullName: oneIdData.full_name,
//       customerId: oneIdData.pin, // PIN ni customerId sifatida saqlash
//       birthday: birthDate,
//       role: 'USER', // Default role (RoleUser enum dan)
//       createdAt: new Date().toISOString(),
//       // password OneID orqali kelganlar uchun shart emas
//       // Agar kerak bo'lsa, random password generatsiya qilish mumkin
//     };
//   }
// }
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { CustomerService } from 'src/customer/customer.service';
import { User, UserDocument } from 'src/user/user.model';
import { LoginAuthDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { OneIdUserData } from './oneid.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly customerService: CustomerService,
  ) {}

  async register(dto: LoginAuthDto) {
    const existUser = await this.isExistUser(dto.email);
    if (existUser) throw new BadRequestException('already_exist');

    const salt = await genSalt(10);
    const passwordHash = await hash(dto.password, salt);

    const newUser = await this.userModel.create({
      ...dto,
      password: dto.password.length ? passwordHash : '',
    });

    await this.customerService.getCustomer(String(newUser._id));
    const token = await this.issueTokenPair(String(newUser._id));

    return { user: this.getUserField(newUser), ...token };
  }

  async login(dto: LoginAuthDto) {
    const existUser = await this.isExistUser(dto.email);
    if (!existUser) throw new BadRequestException('user_not_found');

    // ✅ SECURITY FIX: Empty password login bloklandi
    // Agar user parol bilan ro'yxatdan o'tgan bo'lsa (existUser.password mavjud)
    if (existUser.password && existUser.password.length > 0) {
      // Password talab qilinadi
      if (!dto.password || dto.password.length === 0) {
        throw new BadRequestException('password_required');
      }

      const currentPassword = await compare(dto.password, existUser.password);
      if (!currentPassword) throw new BadRequestException('incorrect_password');
    } else {
      // OneID/Google user - parolsiz login mumkin emas
      throw new BadRequestException('use_oneid_or_google_login');
    }

    await this.customerService.getCustomer(String(existUser._id));
    const token = await this.issueTokenPair(String(existUser._id));
    return { user: this.getUserField(existUser), ...token };
  }

  // OneID uchun yangi method
  async processOneIdUser(oneIdData: OneIdUserData) {
    try {
      // OneID ma'lumotlarini User modeliga moslashtirish
      const mappedUserData = this.mapOneIdToUser(oneIdData);
      console.log('mappedUserData', mappedUserData);

      // PIN yoki custom email orqali mavjud foydalanuvchini qidirish
      let user = await this.userModel.findOne({
        $or: [
          { pin: oneIdData.pin }, // PIN ni customerId sifatida saqlash
          { email: mappedUserData.email }, // Generated email orqali qidirish
        ],
      });
      console.log('user', user);

      if (!user) {
        // Yangi foydalanuvchi yaratish
        user = await this.userModel.create({
          ...mappedUserData,
          createdAt: new Date().toISOString(),
        });
        console.log('CREATED', user);
      } else {
        // Mavjud foydalanuvchini yangilash (ma'lumotlarni refresh qilish)
        Object.assign(user, {
          fullName: mappedUserData.fullName,
          birthday: mappedUserData.birthday,
          pin: mappedUserData.pin,
        });
        await user.save();
      }

      // Customer yaratish yoki olish
      await this.customerService.getCustomer(String(user._id));

      // JWT token generatsiya qilish (mavjud issueTokenPair methodidan foydalanish)
      const token = await this.issueTokenPair(String(user._id));

      return {
        user: this.getUserField(user),
        ...token,
      };
    } catch (error) {
      console.error('Process OneID user error:', error);
      throw new BadRequestException('OneID_user_processing_failed');
    }
  }

  // OneID ma'lumotlarini User modeliga moslashtirish
  private mapOneIdToUser(oneIdData: OneIdUserData): Partial<User> {
    // Birth date ni to'g'ri formatga o'tkazish (YYYYMMDD -> YYYY-MM-DD)
    const birthDate = oneIdData.birth_date
      ? `${oneIdData.birth_date.slice(0, 4)}-${oneIdData.birth_date.slice(
          4,
          6,
        )}-${oneIdData.birth_date.slice(6, 8)}`
      : '';

    // Email yaratish strategiyasi: PIN@oneid.uz yoki user_id@oneid.uz
    // PIN ni ishlatish ko'proq unique bo'ladi
    const email = `${oneIdData.pin}@oneid.uz`;

    return {
      email,
      fullName: oneIdData.full_name,
      pin: oneIdData.pin, // PIN ni customerId sifatida saqlash
      birthday: birthDate,
      role: 'USER', // Default role
      password: '', // OneID orqali kirganlar uchun password kerak emas
    };
  }

  async getNewTokens({ refreshToken }: TokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expired!');

    const user = await this.userModel.findById(result._id);

    const token = await this.issueTokenPair(String(user._id));
    return { user: this.getUserField(user), ...token };
  }

  async checkUser(email: string) {
    const user = await this.isExistUser(email);

    if (user) {
      return 'user';
    } else {
      return 'no-user';
    }
  }

  async isExistUser(email: string): Promise<UserDocument> {
    const existUser = await this.userModel.findOne({ email });
    return existUser;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };

    const refreshToken = await this.jwtService.signAsync(data, { expiresIn: '15d' });

    const accessToken = await this.jwtService.signAsync(data, { expiresIn: '1m' });

    return { refreshToken, accessToken };
  }

  getUserField(user: UserDocument) {
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
      courses: user.courses,
      createdAt: user.createdAt,
      birthday: user.birthday,
      bio: user.bio,
      job: user.job,
    };
  }
}
