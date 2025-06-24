import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import mysql from 'mysql';
import path from 'path';
import getLatestManifest from './components/config/manifest';
import { variables } from './components/config/variables';
import { getReleases } from './components/config/version';
import { fetchArticle, fetchArticleByName, fetchLatestArticles } from './components/search/fetchArticle';
import { APIRequest, APIResponse } from './components/utils/interfaces';
import parseSort from './components/utils/parseSort';
import parseTypes from './components/utils/parseTypes';


const app = express();
const expressPort = process.env.PORT || 4000; // default to port 4000
const connectionPool = mysql.createPool(variables.databaseConfig); // use connection pools
const jsonParser = bodyParser.json(); // application/json parser

// globals for github releases and manifest
let githubReleases: Array<any>;
let manifest: Object;

// fetch manifest on server start-up
manifest = getLatestManifest();
(async () => {
    manifest = await getLatestManifest();
})();



// fetch github releases every 60 seconds
setInterval(async () => {
    githubReleases = await getReleases();
}, 60_000);

// fetch latest manifest every 3 hours
setInterval(async () => {
    manifest = await getLatestManifest();
}, 10_800_000);


// prod and dev cors
if (process.env.MODE === 'production') {
    console.log(variables.allowedOrigins);
    app.use(cors({ origin: variables.allowedOrigins }));
} else {
    app.use(cors());
};


// get graphs by item name
app.post('/api/v1/graphs', jsonParser, async (req, res) => {

    const itemArray: Array<any> = req.body;
    let SVGObject: Object = {}

    for (let item of itemArray) {

        // avoid non-existing file errors from breaking execution
        let SVGString: String;
        try {
            SVGString = fs.readFileSync(`./graphs/${item.itemName}.svg`, 'utf-8');
        } catch (err) {
            SVGString = null;
        };

        SVGObject[`${item.itemName}`] = {
            inventoryItem: item,
            svg: SVGString,
        };
    };

    const response: APIResponse = {
        data: [SVGObject], // object with svg graphs for each item
        items: Object.keys(SVGObject).length, // items returned
        search: null
    };

    res.json(response);
});


// get articles by name (hostedUrl)
app.get('/api/v1/articlesByName', async (req, res) => {

    const articleNames: Array<string> = (<string>req.query.articlenames)?.split(',');

    if (!articleNames || (articleNames.length === 1 && articleNames[0] === '')) {
        res.status(400).json({ error: 'Please provide article names' });
        return;
    }

    await fetchArticleByName(connectionPool, articleNames)
        .then((articles: Array<any>) => {
            let response: APIResponse = {
                data: articles,
                items: articles.length,
                search: articleNames.toString()
            };
            res.json(response);
        })
        .catch(console.error);
});


// query articles database
app.get('/api/v1/articles', async (req, res) => {
    const types: Array<string> = parseTypes(<string>req.query.types); // parse param "types"
    const sort: String = parseSort(<string>req.query.sort); // parse sort param
    const options: APIRequest = {
        searchTerm: <string>req.query.search,
        types: types,
        sort: sort,
        limit: <string>req.query.limit || '25' // Default to 25
    };

    if (!sort) {
        res.status(400).json({ error: 'Please provide a valid sort param' });
        return;
    }

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


// get the latest article
app.get('/api/v1/latestArticle', async (_req, res) => {
    
    await fetchLatestArticles(connectionPool)
        .then((articles: Array<any>) => {
            res.json(articles[0]);
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


// csv
app.get('/api/v1/csv', async (_req, res) => {
    
    const csv = fs.readFileSync(path.join(__dirname, '../ContentStackScraper/csv/articles.csv')); // url won't work in local dev environment
    res.attachment('articles.csv').send(csv);
});


// return the latest bnet API manifest
app.get('/api/v1/manifest', async (_req, res) => {
    res.json(manifest);
});


app.listen(expressPort, () => {
    console.log(`API port: ${expressPort}\nAPI addr: http://<local_device_ip>:${expressPort}`);
});
