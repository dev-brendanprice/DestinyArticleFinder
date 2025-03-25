import dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
    readonly connectionLimit: Number;
    readonly host: String;
    readonly user: String;
    readonly password: String;
    readonly database: String;
}

interface Variables {
    readonly origin: String;
    readonly dbConf: Object;
}

// default to prod
let originURL: String = process.env.PROD_ORIGIN;
let databaseConfig: DatabaseConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

if (process.env.MODE === 'development') {
    originURL = process.env.DEV_ORIGIN;
    databaseConfig = {
        connectionLimit: 10,
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME
    };
}

export const variables: Variables = {
    origin: originURL,
    dbConf: databaseConfig
};
