const express = require('express');
const cors = require('cors');
const app = express();

const mysql = require('mysql');
const dotenv = require('dotenv');
const { databaseConfig, variables } = require('./config/variables');

// express middleware
app.use(cors({
    origin: `${variables.origin}` // allow from dev/prod frontend
}));
console.log(`CORS enabled for ${variables.origin}`);

dotenv.config();
const expressPort = process.env.PORT || 3000;
const connectionPool = mysql.createPool(databaseConfig);


// Create variations from string (e.g. "sunshot", "Sunshot", "SUNSHOT")
function createSearchVariation(substring) {
    return [
        substring.toLowerCase(), // lowercase
        substring.toUpperCase(), // uppercase
        substring.charAt(0).toUpperCase() + substring.slice(1).toLowerCase() // capitalised
    ];
};

// Find article that contains substring
async function findArticleWithSubstring(connectionPool, substring) {
    const variations = createSearchVariation(substring);
    const query = `
        SELECT * FROM articles
        WHERE ${variations.map(variation => `htmlContent LIKE '%${variation}%'`).join(' OR ')} LIMIT 0, 25
    `;

    return new Promise((resolve, reject) => {
        connectionPool.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


// ..
app.get('/api/data', async (req, res) => {

    const substring = req.query.search;
    await findArticleWithSubstring(connectionPool, substring)
    .then(articles => {
        res.json({ data: articles, search: substring })
    })
    .catch(console.error);
});

app.listen(expressPort, () => {
    console.log(`serving: http://localhost:${expressPort}`);
});