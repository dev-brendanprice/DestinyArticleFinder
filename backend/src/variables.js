import dotenv from 'dotenv';
dotenv.config();

let origin = process.env.PROD_ORIGIN; // default to production
let databaseConfig;

if (process.env.MODE === 'production') {

    origin = process.env.PROD_ORIGIN;
    databaseConfig = {
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };

}
else if (process.env.MODE === 'development') {

    origin = process.env.DEV_ORIGIN;
    databaseConfig = {
        connectionLimit: 10,
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME
    };
};

export const variables = {
    origin: origin,
    dbConf: databaseConfig
};