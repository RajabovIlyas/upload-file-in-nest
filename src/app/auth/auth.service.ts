import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { compareSync } from 'bcrypt';
import { RefreshDto } from './dto/refresh.dto';
import constants from '../../common/constants';
import { AuthTokenService } from './auth-token.service';
import { SecurityService } from './security.service';

const {
  ERRORS: {
    MESSAGES: {
      USER_NOT_FOUND,
      TOKEN_NOT_FOUND,
      WRONG_TOKEN,
      USER_ALREADY_EXISTS,
    },
  },
} = constants;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private authTokenService: AuthTokenService,
    private securityService: SecurityService,
    private tokenService: TokenService,
  ) {}

  async singIn({ id, password }: SignInDto) {
    const user = await this.userService.findOne({ id });
    if (!(user && compareSync(password, user.password))) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return this.authTokenService.generateTokensAndSave(user);
  }

  async signUp(signUpDto: SignUpDto) {
    const { id, password } = signUpDto;
    const foundUser = await this.userService.findOne({ id });

    if (foundUser) {
      throw new HttpException(USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.securityService.hash(password);

    await this.userService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    return { id };
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    const { sub: userId, key } = await this.authTokenService.validateToken(
      refreshToken,
      'REFRESH_TOKEN',
    );

    if (!userId) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    const user = await this.userService.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const token = await this.tokenService.findOne({ user, key });

    if (!token) {
      throw new NotFoundException(TOKEN_NOT_FOUND);
    }

    const isTokenCorrect = await this.securityService.compare(
      refreshToken,
      token.refreshToken,
    );

    if (!isTokenCorrect) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    return this.authTokenService.generateTokensAndUpdate(user, token);
  }

  async logout(key: string) {
    return this.tokenService.delete({ key });
  }
}
