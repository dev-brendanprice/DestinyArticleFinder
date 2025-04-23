import dotenv from 'dotenv';
import { AppVariables, DatabaseCredentials } from './interfaces';
dotenv.config();

const mode: String = process.env.MODE;
let allowedOrigins: Array<string> = []; // optional for dev, required for prod
let databaseConfig: DatabaseCredentials;

// diff variables for dev and prod
if (mode === 'development') {
    databaseConfig = {
        connectionLimit: 10,
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME
    };
}
else if (mode === 'production') {
    allowedOrigins = [
        'dev.destinyarticlefinder.com',
        'www.destinyarticlefinder.com',
    ];
    databaseConfig = {
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };
};

export const variables: AppVariables = { allowedOrigins, databaseConfig };