import { createStringVariation } from './createStringVariation.js';

// Find article that contains substring
export async function findArticleWithSubstring(connectionPool, options) {

    const variations = createStringVariation(options.searchTerm);
    const query = `
        SELECT * FROM articles
        WHERE ${variations.map(variation => `htmlContent LIKE '%${variation}%'`).join(' OR ')} LIMIT 0, ${options.limit}
    `;

    return new Promise((resolve, reject) => {
        connectionPool.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};