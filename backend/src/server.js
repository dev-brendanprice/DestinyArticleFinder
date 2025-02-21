const express = require('express');
const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');
const databaseConfig = require('./config/database');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const connectionPool = mysql.createPool(databaseConfig);

// Serve static files from the frontend
// app.use(express.static(path.join(__dirname, '../../frontend/src/')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/src/index.html'));
// });

// Create variations from string (e.g. "sunshot", "Sunshot", "SUNSHOT")
function createSearchVariation(substring) {
    return [
        substring.toLowerCase(), // lowercase
        substring.toUpperCase(), // uppercase
        substring.charAt(0).toUpperCase() + substring.slice(1).toLowerCase() // capitalised
    ];
}

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
}

app.get('/api/data', (req, res) => {
    const substring = req.query.search;
    findArticleWithSubstring(connectionPool, substring)
        .then(articles => {
            res.json({ data: articles, search: substring });
        })
        .catch(console.error);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});