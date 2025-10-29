// import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
// import { User } from 'src/user/decorators/user.decorator';
// import { AuthService } from './auth.service';
// import { Auth } from './decorators/auth.decorator';
// import { LoginAuthDto } from './dto/login.dto';
// import { TokenDto } from './dto/token.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @UsePipes(new ValidationPipe())
//   @HttpCode(200)
//   @Post('register')
//   async register(@Body() dto: LoginAuthDto) {
//     return this.authService.register(dto);
//   }

//   @UsePipes(new ValidationPipe())
//   @HttpCode(200)
//   @Post('login')
//   async login(@Body() dto: LoginAuthDto) {
//     return this.authService.login(dto);
//   }

//   @UsePipes(new ValidationPipe())
//   @HttpCode(200)
//   @Post('access')
//   async getNewTokens(@Body() dto: TokenDto) {
//     return this.authService.getNewTokens(dto);
//   }

//   @HttpCode(200)
//   @Post('check-user')
//   async checkUser(@Body() dto: { email: string }) {
//     return this.authService.checkUser(dto.email);
//   }

//   @HttpCode(200)
//   @Get('check-instructor')
//   @Auth('INSTRUCTOR')
//   async checkInstructo(@User('_id') _id: string) {
//     return _id ? true : false;
//   }
// }

// import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { OneIdService } from './oneid.service';

// @Controller('auth')
// export class AuthController {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly oneIdService: OneIdService,
//   ) {}

//   @Post('oneid/callback')
//   async handleOneIdCallback(@Body() body: { code: string }) {
//     try {
//       const { code } = body;

//       if (!code) {
//         throw new HttpException('Authorization code is required', HttpStatus.BAD_REQUEST);
//       }

//       // 1. OneID serveridan access_token olish
//       const accessToken = await this.oneIdService.getAccessToken(code);

//       // 2. Access token orqali user ma'lumotlarini olish
//       const oneIdUserData = await this.oneIdService.getUserInfo(accessToken);

//       // 3. User ma'lumotlarini database ga saqlash va JWT token generatsiya qilish
//       const result = await this.authService.processOneIdUser(oneIdUserData);

//       return {
//         success: true,
//         token: result.token,
//         user: result.user,
//       };
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'OneID authentication failed',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }

// ********************************
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { LoginAuthDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { OneIdService } from './oneid.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oneIdService: OneIdService,
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: LoginAuthDto) {
    return this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('access')
  async getNewTokens(@Body() dto: TokenDto) {
    return this.authService.getNewTokens(dto);
  }

  @HttpCode(200)
  @Post('check-user')
  async checkUser(@Body() dto: { email: string }) {
    return this.authService.checkUser(dto.email);
  }

  @HttpCode(200)
  @Get('check-instructor')
  @Auth('INSTRUCTOR')
  async checkInstructor(@User('_id') _id: string) {
    return _id ? true : false;
  }

  // OneID uchun yangi endpoint
  @HttpCode(200)
  @Post('oneid/callback')
  async handleOneIdCallback(@Body() body: { code: string }) {
    try {
      const { code } = body;

      if (!code) {
        throw new HttpException('Authorization code is required', HttpStatus.BAD_REQUEST);
      }

      // 1. OneID serveridan access_token olish
      const accessToken = await this.oneIdService.getAccessToken(code);
      console.log('FROM accessToken');

      // 2. Access token orqali user ma'lumotlarini olish
      const oneIdUserData = await this.oneIdService.getUserInfo(accessToken);
      console.log('FROM oneIdUserData');

      // 3. User ma'lumotlarini database ga saqlash va JWT token generatsiya qilish
      const result = await this.authService.processOneIdUser(oneIdUserData);

      return {
        success: true,
        ...result, // user va tokenlar
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'OneID authentication failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
