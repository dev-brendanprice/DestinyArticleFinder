import { createStringVariation } from './createStringVariation.js';

// Find article that contains substring
export async function findArticleWithSubstring(connectionPool, options) {

    const variations = createStringVariation(options.searchTerm);
    let query = '';

    // if types exist
    if (options.types.length > 0) {
        query = `SELECT * FROM articles
        WHERE (${variations.map(variation => `htmlContent LIKE '%${variation}%'`).join(' OR ')})
        AND (${options.types.map(type => `type = '${type}'`).join(' OR ')})
        LIMIT 0, ${options.limit}`;
    } else {
        query = `SELECT * FROM articles
        WHERE ${variations.map(variation => `htmlContent LIKE '%${variation}%'`).join(' OR ')}
        LIMIT 0, ${options.limit}`;
    };

    return new Promise((resolve, reject) => {
        connectionPool.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};