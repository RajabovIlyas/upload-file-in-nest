import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  readonly id: string;
  @IsString()
  readonly password: string;
}
