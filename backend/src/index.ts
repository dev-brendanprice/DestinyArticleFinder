import cors from 'cors';
import express from 'express';
import mysql from 'mysql';
import { fetchArticle, fetchArticleByName } from './utils/fetchArticle';
import parseTypes from './utils/parseTypes';
import { variables } from './utils/variables';
import { getReleases } from './utils/version';

// request/response interfaces
interface RequestOptions {
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
const connectionPool = mysql.createPool(variables.dbConfig);
let githubReleases: Array<any>;

// get releases every 30 seconds for prod, 90 for dev
setInterval(async () => {
    githubReleases = await getReleases();
}, process.env.MODE === 'production' ? 30 * 1000 : 90 * 1000);


// config express and middleware
const app = express();
app.use(cors({ origin: variables.origins }));


// get articles by name (hostedUrl)
app.get('/api/v1/articlesByName', async (req, res) => {

    const articleNames: Array<string> = (<string>req.query.a)?.split(',');

    if (!articleNames || (articleNames.length === 1 && articleNames[0] === '')) {
        res.status(400).json({ error: 'Please provide article names' });
        return;
    }

    await fetchArticleByName(connectionPool, articleNames)
        .then((articles: Array<any>) => {
            let response: APIResponse = {
                data: articles,
                items: articles.length,
                search: <string>req.query.articles // doesnt return ??
            };
            res.json(response);
        })
        .catch(console.error);
});

// query articles database
app.get('/api/v1/articles', async (req, res) => {
    const types: Array<string> = parseTypes(<string>req.query.types); // parse param "types"
    const options: RequestOptions = {
        searchTerm: <string>req.query.search,
        types: types,
        limit: <string>req.query.limit || '25'
    };

    if (!options.searchTerm) {
        res.status(400).json({ error: 'Please provide a search query param' });
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

// get latest app version from github releases
app.get('/api/v1/releases', async (_req, res) => {
    
    // request releases if none are stored
    if (!(githubReleases?.length > 0)) {
        githubReleases = await getReleases()
            .then(data => { return data })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'A server error has occured. Please try again later' });
            });
    };

    res.json(githubReleases);
});

app.listen(expressPort, () => {
    console.log(`serving: ${process.env.DEV_ORIGIN}`);
});
