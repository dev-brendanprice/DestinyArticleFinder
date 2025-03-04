import express from 'express';
const app = express();
import cors from 'cors';
import mysql from 'mysql';
import { variables } from './variables.js';
import { findArticleWithSubstring } from './modules/findArticleWithSubstr.js';
console.log(variables);

// express middleware
app.use(cors({
    origin: `${variables.origin}` // allow from dev/prod frontend
}));
console.log(`CORS enabled for ${variables.origin}`);

// globals
const expressPort = process.env.PORT || 3000;
const connectionPool = mysql.createPool(variables.dbConf);



// query articles database
app.get('/api/v1/articles', async (req, res) => {

    const substring = req.query.search;
    await findArticleWithSubstring(connectionPool, substring)
        .then(articles => {
            res.json({
                data: articles,
                items: articles.length,
                search: substring
            });
        })
        .catch(console.error);
});

app.listen(expressPort, () => {
    console.log(`serving: http://localhost:${expressPort}`);
});