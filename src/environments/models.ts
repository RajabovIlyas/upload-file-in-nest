import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Environment {
  production: boolean;
  db?: TypeOrmModuleOptions;
  token: { accessToken: { secret: string }; refreshToken: { secret: string } };
  encryption?: { secretKey: string };
}
