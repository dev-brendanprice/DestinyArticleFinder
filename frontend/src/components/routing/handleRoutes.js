import { renderArticle } from '../render/renderArticle.js';
import { fetchArticlesByName } from '../search/fetchArticles.js';
import { addTabToGroup, TabGroup } from './tabGroup.js';

export async function handleRoutes() {
    const locationPathname = window.location.pathname;
    const urlSearchParams = new URLSearchParams(window.location.search);
    let nameQueries = urlSearchParams.get('a');
    let searchQueries = urlSearchParams.get('s');
    let modeQuery = urlSearchParams.get('m') === 'true'; // boolean

    // redirect back to origin, if not equal to above pathname(s)
    if (locationPathname !== '/article') {
        window.history.pushState(null, '', window.location.origin);
    }

    // render the article with no search term when "m" is set to True
    if (nameQueries && modeQuery) {
        const article = await fetchArticlesByName(nameQueries);
        console.log(article);

        document.getElementsByTagName('body')[0].style.backgroundImage = 'unset';

        addTabToGroup(article.data[0], '');
        renderArticle(article.data[0], ''); // render article
    }

    // fetch articles and match articles based on the index of queries in .split() array results
    if (nameQueries && searchQueries) {
        const articles = await fetchArticlesByName(nameQueries);
        searchQueries = searchQueries.split(',');
        nameQueries = nameQueries.split(',');

        document.getElementsByTagName('body')[0].style.backgroundImage = 'unset'; // remove DOM background as we are loading articles (png)

        // uses indexes of search and article name queries to find matching article for each
        for (let query of nameQueries) {
            const matchedArticle = articles.data.filter(v => v.hostedUrl === query);
            const indexOfArticleName = nameQueries.indexOf(query);
            const matchedSearchQuery = searchQueries[indexOfArticleName];
            addTabToGroup(matchedArticle[0], matchedSearchQuery);
            renderArticle(matchedArticle[0], matchedSearchQuery);
        }
    }
}

// remove article and search from route
export function removeArticleFromRoute(articleName, search) {

    if (TabGroup.tabArticles.length === 1) {return;} // avoid error when closing last tab, therefore no params are present

    const params = new URLSearchParams(window.location.search);
    const searchParams = params.get('s').split(',');
    const nameParams = params.get('a').split(',');

    // remove specified articleName and search from param arrays
    searchParams.splice(searchParams.indexOf(search), 1);
    nameParams.splice(nameParams.indexOf(articleName), 1);

    // set params again
    params.set('a', nameParams.join(','));
    params.set('s', searchParams.join(','));

    // set new location path
    const newPath = window.location.origin + '/article';
    window.history.pushState(null, '', newPath + '?' + params.toString());
}

export function mapArticleToRoute(articleName, searchTerm) {
    const params = window.location.search;
    const articleNameStr = articleName;
    const searchTermStr = searchTerm;
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

        // append new query params, update URL without reloading
        window.history.pushState(null, '', newPath + '?' + searchParams.toString());
    } else {
        // create query params if none exist, update URL without reloading
        window.history.pushState(null, '', newPath + `?a=${articleNameStr}&s=${searchTermStr}`);
    }
}
