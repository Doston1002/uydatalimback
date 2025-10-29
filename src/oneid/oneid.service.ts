import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OneIdService {
  private readonly logger = new Logger(OneIdService.name);
  private readonly authUrl = process.env.ONEID_AUTH_URL!; // https://sso.egov.uz/sso/oauth/Authorization.do

  constructor(private readonly jwtService: JwtService) {}

  /**
   * 1. Avtorizatsiya URL yaratish
   */
  getAuthorizationUrl(state: string) {
    const params = new URLSearchParams({
      response_type: 'one_code',
      client_id: process.env.ONEID_CLIENT_ID!,
      redirect_uri: process.env.ONEID_REDIRECT_URI!,
      scope: process.env.ONEID_SCOPE!,
      state,
    });
    return `${this.authUrl}?${params.toString()}`;
  }

  /**
   * 2. CODE -> ACCESS TOKEN
   */
  async exchangeCodeForToken(code: string) {
    const params = new URLSearchParams({
      grant_type: 'one_authorization_code',
      client_id: process.env.ONEID_CLIENT_ID!,
      client_secret: process.env.ONEID_CLIENT_SECRET!,
      redirect_uri: process.env.ONEID_REDIRECT_URI!,
      code,
    });

    const { data } = await axios.post(this.authUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return data; // { access_token, refresh_token, expires_in, ... }
  }

  /**
   * 3. ACCESS TOKEN -> USER INFO
   */
  async getUserInfo(accessToken: string) {
    const params = new URLSearchParams({
      grant_type: 'one_access_token_identify',
      client_id: process.env.ONEID_CLIENT_ID!,
      client_secret: process.env.ONEID_CLIENT_SECRET!,
      access_token: accessToken,
      scope: process.env.ONEID_SCOPE!,
    });

    const { data } = await axios.post(this.authUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return data; // foydalanuvchi haqida JSON
  }

  /**
   * 4. LOGOUT (access_token invalid qilish)
   */
  async logout(accessToken: string) {
    const params = new URLSearchParams({
      grant_type: 'one_log_out',
      client_id: process.env.ONEID_CLIENT_ID!,
      client_secret: process.env.ONEID_CLIENT_SECRET!,
      access_token: accessToken,
      scope: process.env.ONEID_SCOPE!,
    });

    const { data } = await axios.post(this.authUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return data;
  }

  /**
   * JWT yaratish
   */
  signJwt(payload: any) {
    return this.jwtService.sign(payload);
  }
}
