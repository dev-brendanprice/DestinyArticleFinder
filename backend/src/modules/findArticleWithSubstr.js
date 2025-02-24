import { createStringVariation } from './createStringVariation.js';

// Find article that contains substring
export async function findArticleWithSubstring(connectionPool, substring) {
    const variations = createStringVariation(substring);
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