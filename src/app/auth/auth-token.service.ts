import { AuthResponseDto } from './dto/auth-response.dto';
import { SecurityService } from './security.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { AuthTokenData, AuthTokens } from './interfaces/auth-token.interface';
import constants from '../../common/constants';
import { TokenService } from '../token/token.service';
import { Token } from '../token/token.entity';

@Injectable()
export class AuthTokenService {
  constructor(
    private securityService: SecurityService,
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  getTokenByKey(key: string) {
    return this.tokenService.findOne({ key });
  }

  async generateTokensAndSave(user: User): Promise<AuthResponseDto> {
    const key = uuid();
    const tokens: AuthTokens = await this.generateTokens(user, key);
    const { refreshToken } = tokens;

    await this.saveRefreshToken(user, refreshToken, key);

    return tokens;
  }

  async generateTokensAndUpdate(
    user: User,
    token: Token,
  ): Promise<AuthResponseDto> {
    const key = uuid();
    const tokens: AuthTokens = await this.generateTokens(user, key);
    const { refreshToken } = tokens;

    await this.tokenService.update(token.id, { refreshToken, key });

    return tokens;
  }

  async validateToken(
    token: string,
    tokenType: string,
  ): Promise<AuthTokenData> {
    const data = await this.jwtService.verifyAsync(token, {
      secret: constants.TOKEN[tokenType].SECRET,
    });

    return data;
  }

  private async generateTokens(user: User, key: string): Promise<AuthTokens> {
    const payload = { userId: user.id, password: user.password, key };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(
    user: User,
    token: string,
    key: string,
  ): Promise<void> {
    const hashedToken = await this.securityService.hash(token);
    await this.tokenService.create({ user, refreshToken: hashedToken, key });
  }

  private async generateAccessToken({ userId, password, key }): Promise<string> {
    const {
      TOKEN: {
        ACCESS_TOKEN: { SECRET, EXPIRES_IN },
      },
    } = constants;

    return this.jwtService.signAsync(
      { sub: userId, password, key },
      {
        secret: SECRET,
        expiresIn: EXPIRES_IN,
      },
    );
  }

  private async generateRefreshToken({ userId, key }): Promise<string> {
    const {
      TOKEN: {
        REFRESH_TOKEN: { SECRET, EXPIRES_IN },
      },
    } = constants;

    return this.jwtService.signAsync(
      { sub: userId, key },
      {
        secret: SECRET,
        expiresIn: EXPIRES_IN,
      },
    );
  }
}
