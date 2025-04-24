export function fetchArticleByName(connectionPool: any, articles: Array<string>): Promise<object> {
    const sqlQuery = `
        SELECT * FROM articles
        WHERE ${articles.map(v => `lower(hostedUrl)=lower('${v}')`).join(' OR ')}
    `;

    return new Promise((resolve, reject) => {
        connectionPool.query(sqlQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

export function fetchLatestArticles(connectionPool: any): Promise<object> {
    const sqlQuery = `
        SELECT * FROM articles
        ORDER BY date DESC
        LIMIT 0, 10;
    `;

    return new Promise((resolve, reject) => {
        connectionPool.query(sqlQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

export function fetchArticle(connectionPool: any, options: any): Promise<object> {
    const searchTerm = options.searchTerm.replaceAll("'", "''");
    let sqlQuery: String = `
        SELECT * FROM articles
        WHERE lower(htmlContent) LIKE lower('%${searchTerm}%') OR
        lower(title) LIKE lower('%${searchTerm}%')
        LIMIT 0, ${options.limit};
    `;

    // if types are specified
    if (!options.types.includes('all')) {
        sqlQuery = `
            SELECT * FROM articles
            WHERE lower(htmlContent) LIKE lower('%${searchTerm}%') OR
            lower(title) LIKE lower('%${searchTerm}%')
            AND (${options.types.map((type: String) => `type = '${type}'`).join(' OR ')})
            LIMIT 0, ${options.limit};
        `;
    }

    return new Promise((resolve, reject) => {
        connectionPool.query(sqlQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}
