import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from '../token/token.module';
import { SecurityService } from './security.service';
import { AuthTokenService } from './auth-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SecurityService, AuthTokenService],
  imports: [JwtModule.register({}), forwardRef(() => UserModule), TokenModule],
  exports: [AuthService, AuthTokenService, SecurityService, UserModule],
})
export class AuthModule {}
