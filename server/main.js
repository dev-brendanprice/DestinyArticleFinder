const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = 3000;

const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`
});

// ..
app.use(express.static(path.join(__dirname, '../client/src/')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/index.html'));
});


// create variations from string (e.g. "sunshot", "Sunshot", "SUNSHOT")
function createSearchVariation(substring) {
    return [
        substring.toLowerCase(), // lowercase
        substring.toUpperCase(), // uppercase
        substring.charAt(0).toUpperCase() + substring.slice(1).toLowerCase() // capitalised
    ];
};

// find article that contains substring
async function findArticleWithSubstring(connectionPool, substring) {
    const variations = createSearchVariation(substring);
    const query = `
        SELECT * FROM articles
        WHERE ${variations.map(variation => `htmlContent LIKE '%${variation}%'`).join(' OR ')} LIMIT 0, 25
    `; // returns htmlContent LIKE variation OR variation

    return new Promise((resolve, reject) => {
        connectionPool.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

app.get('/api/data', (req, res) => {
    
    const substring = req.query.search;
    findArticleWithSubstring(connectionPool, substring)
    .then(articles => {
        res.json({data: articles, search: substring});
    })
    .catch(console.error);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});