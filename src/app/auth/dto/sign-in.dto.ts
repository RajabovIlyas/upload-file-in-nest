import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  readonly id: string;
  @IsString()
  readonly password: string;
}
