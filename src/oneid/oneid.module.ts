import { Module } from '@nestjs/common';
import { OneIdController } from './oneid.controller';
import { OneIdService } from './oneid.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_jwt_secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  controllers: [OneIdController],
  providers: [OneIdService],
})
export class OneIdModule {}
