import { Environment } from './models';

export const environment: Environment = {
    production: false,
    db: {
        type: 'mysql',
        host: 'localhost',
        port: 3305,
        username: 'root',
        password: 'root',
        database: 'fileManager',
        entities: [],
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
    }
};
