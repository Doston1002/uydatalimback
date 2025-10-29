import { Controller, Get, Post, Query, Body, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { OneIdService } from './oneid.service';

@Controller('oneid')
export class OneIdController {
  private readonly logger = new Logger(OneIdController.name);

  constructor(private readonly oneIdService: OneIdService) {}

  /**
   * Step 1: Login URL qaytarish
   */
  @Get('login-url')
  getLoginUrl(@Query('state') state: string) {
    return { url: this.oneIdService.getAuthorizationUrl(state || 'random_state') };
  }

  /**
   * Step 2: Callback (OneID redirect qiladi shu yerga)
   */
  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      if (!code) {
        return res.status(400).send("Code yo'q");
      }

      // 1) Code -> Token
      const tokenData = await this.oneIdService.exchangeCodeForToken(code);
      const accessToken = tokenData.access_token;

      // 2) Token -> User Info
      const userInfo = await this.oneIdService.getUserInfo(accessToken);

      // 3) JWT yaratish
      const jwt = this.oneIdService.signJwt({
        pin: userInfo.pin,
        full_name: userInfo.full_name,
        user_id: userInfo.user_id,
      });

      // 4) Cookie saqlash
      res.cookie('auth_token', jwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      // 5) Asosiy sahifaga redirect
      return res.redirect('/');
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send('OneID xatolik');
    }
  }

  /**
   * Step 3: Token orqali user info olish (API orqali)
   */
  @Post('userinfo')
  async userInfo(@Body('access_token') accessToken: string) {
    return await this.oneIdService.getUserInfo(accessToken);
  }

  /**
   * Step 4: Logout qilish
   */
  @Post('logout')
  async logout(@Body('access_token') accessToken: string, @Res() res: Response) {
    const result = await this.oneIdService.logout(accessToken);
    res.clearCookie('auth_token');
    return res.json(result);
  }
}
