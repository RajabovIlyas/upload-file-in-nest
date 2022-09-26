import { Environment } from './models';
import { User } from '../app/user/user.entity';
import { File } from '../app/file/file.entity';
import { Token } from '../app/token/token.entity';

export const environment: Environment = {
  production: false,
  db: {
    type: 'mysql',
    host: 'localhost',
    port: 3305,
    username: 'root',
    password: 'root',
    database: 'fileManager',
    entities: [User, File, Token],
    synchronize: true,
  },
  token: {
    refreshToken: {
      secret: 'refresh_token_secret',
    },
    accessToken: {
      secret: 'access_token_secret',
    },
  },
  encryption: {
    secretKey: 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
  },
};
