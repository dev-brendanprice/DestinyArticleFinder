import { fetchArticlesByName } from './fetchArticles.js';
import { renderArticle } from './renderArticle.js';
import { addTabToGroup } from './tabGroup.js';

export async function handleRoutes() {
    // get URL
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    let articleNames = urlParams.get('a');

    // if path is article and query params exist
    if (path === '/article' && articleNames) {
        const articles = await fetchArticlesByName(articleNames);
        const searchQueries = urlParams.get('s').split(',');

        // load articles
        document.getElementsByTagName('body')[0].style.backgroundImage = 'unset'; // remove background (png)
        articleNames = articleNames.split(',');

        // uses indexes of search and article name queries to find matching article for each
        for (let query of articleNames) {
            const matchedArticle = articles.data.filter(v => v.hostedUrl === query);
            const indexOfArticleName = articleNames.indexOf(query);
            const matchedSearchQuery = searchQueries[indexOfArticleName];
            addTabToGroup(matchedArticle[0], matchedSearchQuery);
            renderArticle(matchedArticle[0], matchedSearchQuery);
        }
    } else {
        // update URL without reloading URL
        window.history.pushState(null, '', window.location.origin);
    }
}

// remove article and search from route
export function removeArticleFromRoute(articleName, search) {
    console.log(articleName, search);
    // get params
    const params = new URLSearchParams(window.location.search);

    let searchParams = params.get('s').split(',');
    searchParams.splice(searchParams.indexOf(search), 1);

    let nameParams = params.get('a').split(',');
    nameParams.splice(nameParams.indexOf(articleName), 1);

    // set remaining params
    params.set('a', nameParams.join(','));
    params.set('s', searchParams.join(','));

    let newPath = window.location.origin + '/article';
    newPath += '?' + params.toString();

    window.history.pushState(null, '', newPath);
}

export function mapArticleToRoute(articleName, searchTerm) {
    // force articleName and searchTerm to String()
    const articleNameStr = String(articleName);
    const searchTermStr = String(searchTerm);

    // get query params
    const params = window.location.search;
    let newPath = window.location.origin + '/article';

    // maintain existing params if they exist
    if (params) {
        const searchParams = new URLSearchParams(params);

        // update query params
        let existingArticles = searchParams.get('a') ? searchParams.get('a').split(',') : [];
        let existingSearches = searchParams.get('s') ? searchParams.get('s').split(',') : [];

        existingArticles.push(articleNameStr);
        existingSearches.push(searchTermStr);

        searchParams.set('a', existingArticles.join(','));
        searchParams.set('s', existingSearches.join(','));

        // append new query params
        newPath += '?' + searchParams.toString();
    } else {
        // create query params if none exist
        newPath += `?a=${articleNameStr}&s=${searchTermStr}`;
    }

    // update URL without reloading
    window.history.pushState(null, '', newPath);
}
