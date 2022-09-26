import { environment } from '../../environments/environment';

const {
  encryption,
  token: { accessToken, refreshToken },
} = environment;

const constants = {
  SECRET_KEY: encryption.secretKey,
  TOKEN: {
    TYPE: 'Bearer',
    ACCESS_TOKEN: {
      SECRET: accessToken.secret,
      EXPIRES_IN: '10m',
    },
    REFRESH_TOKEN: {
      SECRET: refreshToken.secret,
      EXPIRES_IN: '1d',
    },
  },
  ENCRYPTION: {
    SECRET_KEY: encryption.secretKey,
    ALGORITHM: 'aes-256-ctr',
  },
  ERRORS: {
    MESSAGES: {
      USER_NOT_FOUND: 'UserNotFound',
      FILE_NOT_FOUND: 'FileNotFound',
      TOKEN_NOT_FOUND: 'TokenNotFound',
      WRONG_TOKEN: 'WrongToken',
      USER_ALREADY_EXISTS: 'UserAlreadyExists',
    },
  },
};

export default constants;
