import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import {
    Injectable,
} from '@nestjs/common';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private tokenService: TokenService
    ) {}
}
