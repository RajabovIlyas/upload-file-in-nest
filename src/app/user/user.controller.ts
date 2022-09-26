import { UserService } from './user.service';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/info')
  async info(@Request() req) {
    return { id: req?.user?.id };
  }
}
