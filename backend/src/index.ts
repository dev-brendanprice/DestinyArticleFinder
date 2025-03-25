import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import fetchArticle from './utils/fetchArticle';
import parseTypes from './utils/parseTypes';
import { variables } from './utils/variables';

interface ResponseOptions {
    readonly searchTerm: String;
    readonly types: Array<string>;
    readonly limit: String;
}

interface APIResponse {
    readonly data: Array<any>;
    readonly items: Number;
    readonly search: String;
}

// globals
const expressPort = process.env.PORT || 3000;
const connectionPool = mysql.createPool(variables.dbConf);

// config express and middleware
const app = express();
app.use(
    cors({
        origin: `${variables.origin}` // allow from dev/prod frontend
    })
);

// query articles database
app.get('/api/v1/articles', async (req, res) => {
    const types: Array<string> = parseTypes(<string>req.query.types); // parse param "types"
    const options: ResponseOptions = {
        searchTerm: <string>req.query.search,
        types: types,
        limit: <string>req.query.limit || '25'
    };

    if (!options.searchTerm) {
        res.end('Please provide a search query param');
        return;
    }

    await fetchArticle(connectionPool, options)
        .then((articles: Array<any>) => {
            let response: APIResponse = {
                data: articles,
                items: articles.length,
                search: options.searchTerm
            };
            res.json(response);
        })
        .catch(console.error);
});

app.listen(expressPort, () => {
    console.log(`serving: http://localhost:${expressPort}`);
});
