import { fetchArticlesByName } from './fetchArticles.js';
import { renderArticle } from './renderArticle.js';
import { addTabToGroup } from './tabGroup.js';

export async function handleRoutes() {
    // get URL
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const articleNames = urlParams.get('a');

    // if path is article and query params exist
    if (path === '/article' && articleNames) {
        const response = await fetchArticlesByName(articleNames);
        const articles = response.data;
        const term = urlParams.get('s').split(',');

        console.log(urlParams.get('a').split(','), urlParams.get('s').split(','), articles);

        // load articles
        document.getElementsByTagName('body')[0].style.backgroundImage = 'unset'; // remove background (png)
        for (let i = 0; i < articles.length; i++) {
            let article = articles[i];
            addTabToGroup(article, term[i]);
            renderArticle(article, term[i]);
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
