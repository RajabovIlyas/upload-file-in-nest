import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  logIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authService.singIn(signInDto);
  }

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin/new_token')
  refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Request() { key }) {
    await this.authService.logout(key);
    return { message: 'You have been logged out!', code: HttpStatus.OK };
  }
}
