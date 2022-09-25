import { environment } from '../../../environments/environment';

const {
    token: { accessToken, refreshToken },
    encryption,
} = environment;

const constants = {
    TOKEN: {
        TYPE: 'Bearer',
        ACCESS_TOKEN: {
            SECRET: accessToken.secret,
            EXPIRES_IN: '60m',
        },
        REFRESH_TOKEN: {
            SECRET: refreshToken.secret,
            EXPIRES_IN: '14d',
        },
    },
    ENCRYPTION: {
        SECRET_KEY: encryption.secretKey,
        ALGORITHM: 'aes-256-ctr',
    },
};

export default constants
