// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { ConfigService } from '@nestjs/config';
// import { firstValueFrom } from 'rxjs';

// export interface OneIdUserData {
//     valid: string;
//     validation_method: string[];
//     pin: string;
//     user_id: string;
//     full_name: string;
//     pport_no: string;
//     birth_date: string;
//     sur_name: string;
//     first_name: string;
//     mid_name: string;
//     user_type: string;
//     sess_id: string;
//     ret_cd: string;
//     auth_method: string;
//     pkcs_legal_tin: string;
//     legal_info: Array<{
//         is_basic: boolean;
//         tin: string;
//         acron_UZ: string;
//         le_tin: string;
//         le_name: string;
//     }>;
// }

// @Injectable()
// export class OneIdService {
//     private readonly oneIdBaseUrl: string;
//     private readonly clientId: string;
//     private readonly clientSecret: string;
//     private readonly redirectUri: string;

//     constructor(
//         private readonly httpService: HttpService,
//         private readonly configService: ConfigService,
//     ) {
//         // Environment variables dan olish
//         this.oneIdBaseUrl = this.configService.get('ONEID_BASE_URL');
//         this.clientId = this.configService.get('ONEID_CLIENT_ID');
//         this.clientSecret = this.configService.get('ONEID_CLIENT_SECRET');
//         this.redirectUri = this.configService.get('ONEID_REDIRECT_URI');
//     }

//     async getAccessToken(code: string): Promise<string> {
//         try {
//             const tokenUrl = `${this.oneIdBaseUrl}/oauth2/token`;

//             const params = new URLSearchParams({
//                 grant_type: 'authorization_code',
//                 client_id: this.clientId,
//                 client_secret: this.clientSecret,
//                 code: code,
//                 redirect_uri: this.redirectUri,
//             });

//             const response = await firstValueFrom(
//                 this.httpService.post(tokenUrl, params.toString(), {
//                     headers: {
//                         'Content-Type': 'application/x-www-form-urlencoded',
//                     },
//                 }),
//             );

//             if (!response.data.access_token) {
//                 throw new Error('Access token not received from OneID');
//             }

//             return response.data.access_token;
//         } catch (error) {
//             console.error('OneID token exchange error:', error);
//             throw new HttpException(
//                 'Failed to exchange code for access token',
//                 HttpStatus.BAD_REQUEST,
//             );
//         }
//     }

//     async getUserInfo(accessToken: string): Promise<OneIdUserData> {
//         try {
//             const userInfoUrl = `${this.oneIdBaseUrl}/oauth2/userinfo`;

//             const response = await firstValueFrom(
//                 this.httpService.post(
//                     userInfoUrl,
//                     {},
//                     {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`,
//                             'Content-Type': 'application/json',
//                         },
//                     },
//                 ),
//             );

//             if (response.data.ret_cd !== '0') {
//                 throw new Error('Invalid response from OneID user info endpoint');
//             }

//             return response.data;
//         } catch (error) {
//             console.error('OneID user info error:', error);
//             throw new HttpException(
//                 'Failed to get user information from OneID',
//                 HttpStatus.BAD_REQUEST,
//             );
//         }
//     }
// }

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface OneIdUserData {
  valid: string;
  validation_method: string[];
  pin: string;
  user_id: string;
  full_name: string;
  pport_no: string;
  birth_date: string;
  sur_name: string;
  first_name: string;
  mid_name: string;
  user_type: string;
  sess_id: string;
  ret_cd: string;
  auth_method: string;
  pkcs_legal_tin: string;
  legal_info: Array<{
    is_basic: boolean;
    tin: string;
    acron_UZ: string;
    le_tin: string;
    le_name: string;
  }>;
}

@Injectable()
export class OneIdService {
  private readonly oneIdBaseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.oneIdBaseUrl = this.configService.get('ONEID_BASE_URL');
    this.clientId = this.configService.get('ONEID_CLIENT_ID');
    this.clientSecret = this.configService.get('ONEID_CLIENT_SECRET');
    this.redirectUri = this.configService.get('ONEID_REDIRECT_URI');
  }

  async getAccessToken(code: string): Promise<string> {
    try {
      const tokenUrl = `${this.oneIdBaseUrl}`;
      console.log('FROM tokenUrl');

      const params = new URLSearchParams({
        grant_type: 'one_authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri,
      });
      console.log('FROM params');

      const response = await axios.post(tokenUrl, undefined, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params,
      });

      console.log(response.data);

      if (!response.data.access_token) {
        throw new Error('Access token not received from OneID');
      }

      return response.data.access_token;
    } catch (error) {
      console.error('OneID token exchange error:', error);
      throw new HttpException('Failed to exchange code for access token', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserInfo(accessToken: string): Promise<OneIdUserData> {
    try {
      const userInfoUrl = `${this.oneIdBaseUrl}`;
      console.log('FROM userInfoUrl');

      const params = new URLSearchParams({
        grant_type: 'one_access_token_identify',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        access_token: accessToken,
        scope: 'uydatalim_uzedu_uz',
      });
      console.log('FROM params');

      // const response = await firstValueFrom(
      //     this.httpService.post(
      //         userInfoUrl,
      //         {},
      //         {
      //             headers: {
      //                 Authorization: `Bearer ${accessToken}`,
      //                 'Content-Type': 'application/json',
      //             },
      //         },
      //     ),
      // );

      const response = await axios.post(userInfoUrl, undefined, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params,
      });

      console.log(response.data);

      if (response.data.ret_cd !== '0') {
        throw new Error('Invalid response from OneID user info endpoint');
      }

      return response.data;
    } catch (error) {
      console.error('OneID user info error:', error);
      throw new HttpException('Failed to get user information from OneID', HttpStatus.BAD_REQUEST);
    }
  }
}
