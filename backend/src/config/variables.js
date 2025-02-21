const dotenv = require('dotenv');
dotenv.config();

let origin = process.env.PROD_ORIGIN; // default to production
if (process.env.MODE === 'production') {
    origin = process.env.PROD_ORIGIN;
}
else if (process.env.MODE === 'development') {
    origin = process.env.DEV_ORIGIN;
};

const databaseConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const variables = {
    origin: origin
};

module.exports = {databaseConfig, variables};