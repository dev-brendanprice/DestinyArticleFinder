/*
    Credentials for MySQL Database
    connectionLimit: limit of connections allowed in connection pool
    database: the name of the database
*/
export interface DatabaseCredentials {
    readonly connectionLimit: Number;
    readonly host: String;
    readonly user: String;
    readonly password: String;
    readonly database: String;
}

// Object with process env variables and database config
export interface AppVariables {
    readonly allowedOrigins: Array<string>;
    readonly databaseConfig: Object;
}

// Format of a request, sent to the API
export interface APIRequest {
    readonly searchTerm: String;
    readonly types: Array<string>;
    readonly limit: String;
}

// Format of a response, sent back by the API
export interface APIResponse {
    readonly data: Array<any>;
    readonly items: Number;
    readonly search: String;
}