import getCaseVariants from './getCaseVariants';

export default function fetchArticle(connectionPool: any, options: any): Promise<object> {
    const variations = getCaseVariants(<string>options.searchTerm);
    let sqlQuery: String = `
        SELECT * FROM articles
        WHERE ${variations.map(variation => `htmlContent LIKE '%${variation}%'`).join(' OR ')}
        LIMIT 0, ${options.limit}
    `;

    // if types are specified
    if (!options.types.includes('all')) {
        sqlQuery = `
            SELECT * FROM articles
            WHERE (${variations.map((variation: String) => `htmlContent LIKE '%${variation}%'`).join(' OR ')})
            AND (${options.types.map((type: String) => `type = '${type}'`).join(' OR ')})
            LIMIT 0, ${options.limit}
        `;
    }
    // fubar

    return new Promise((resolve, reject) => {
        connectionPool.query(sqlQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}
