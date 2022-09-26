import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthTokenService } from '../auth-token.service';
import { UserService } from '../../user/user.service';
import constants from '../../../common/constants';

const {
  TOKEN: { TYPE },
} = constants;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger: Logger;

  constructor(
    private authTokenService: AuthTokenService,
    private userService: UserService,
  ) {
    this.logger = new Logger(JwtAuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const { authorization, Authorization } = request.headers;
      const tokenHeaderValue = authorization || Authorization;
      const [bearer, token] = tokenHeaderValue.split(' ');

      if (bearer !== TYPE || !token) {
        throw new UnauthorizedException({ message: 'user not authorized' });
      }

      const { sub: userId, key } = await this.authTokenService.validateToken(
        token,
        'ACCESS_TOKEN',
      );
      const tokenAccess = await this.authTokenService.getTokenByKey(key);

      if (!tokenAccess) {
        throw new UnauthorizedException({ message: 'user not authorized' });
      }

      const user = await this.userService.findOne({ id: userId });
      request.user = user;
      request.key = key;

      return true;
    } catch (err) {
      this.logger.error('user not authorized', err);
      throw new UnauthorizedException({ message: 'user not authorized' });
    }
  }
}
