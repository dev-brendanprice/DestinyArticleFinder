export function getSearchStats(articles, searchTerm) {
    // sort articles by date to get first and last (most recent) mentions
    const firstMention = articles.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const lastMention = articles.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    // enumerate over articles to get: most mentions and total mentions
    let matches = [];
    for (let article of articles) {
        const regex = new RegExp(`(${searchTerm})`, 'gi'); // case-insensitive search
        const htmlContent = article.htmlContent;
        matches.push([[...htmlContent.matchAll(regex)].length, article]);
    }

    const mostMentions = matches.sort((a, b) => b[0] - a[0]);
    const totalMentions = matches.reduce((a, c) => a + c[0], 0);

    return {
        firstMention: firstMention,
        lastMention: lastMention,
        mostMentions: mostMentions[0], // return first article
        totalMentions: totalMentions
    };
}
