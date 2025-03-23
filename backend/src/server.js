import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import { variables } from './variables.js';
import { findArticleWithSubstring } from './modules/findArticleWithSubstr.js';

const app = express();
console.log(variables);

// express middleware
app.use(cors({
    origin: `${variables.origin}` // allow from dev/prod frontend
}));
console.log(`CORS enabled for ${variables.origin}`);

// globals
// eslint-disable-next-line no-undef
const expressPort = process.env.PORT || 3000;
const connectionPool = mysql.createPool(variables.dbConf);



// query articles database
app.get('/api/v1/articles', async (req, res) => {

    let types = Array.from(new Set(req.query.types?.split(','))); // Set() ignores duplicates
    types = types.map(v => { return v.toLowerCase() });

    const options = {
        searchTerm: req.query.search,
        types: types,
        limit: parseInt(req.query.limit) || 25
    };

    await findArticleWithSubstring(connectionPool, options)
        .then(articles => {
            res.json({
                data: articles,
                items: articles.length,
                search: options.searchTerm
            });
        })
        .catch(console.error);
});

app.listen(expressPort, () => {
    console.log(`serving: http://localhost:${expressPort}`);
});