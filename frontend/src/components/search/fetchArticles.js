import { API_HOST } from '../../index.js';
import { activeFilterValues } from './filterResults.js';
import { activeSortByValue } from './sortResults.js';

let currentController = null;

// fetch articles by name (hostedUrl) from server
export async function fetchArticlesByName(articleNames) {

    let url = `${API_HOST}/api/v1/articlesByName?articlenames=${articleNames}`;

    const articles = await fetch(url)
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);
            return [];
        });

    return articles;
}

// Tell server to return matching articles, using specified search term
export async function fetchArticles(searchTerm) {

    // cancel previous request
    if (currentController) {
        currentController.abort();
    };

    // create new abortController for this request
    currentController = new AbortController();
    const signal = currentController.signal;

    // get sort-by query param string
    const sortValue = Object.keys(activeSortByValue).find(key => activeSortByValue[key]);
    const sorts = {
        'typeDateDES': 'datedes',
        'typeDateASC': 'dateasc',
        'typeABC': 'abc'
    };
    const sortByString = sorts[sortValue]; // get sort-by param string
    let url = `${API_HOST}/api/v1/articles?search=${encodeURIComponent(searchTerm)}&sort=${sortByString}`;

    // if active filter != "ALL"
    if (!activeFilterValues.typeAll) {
        const types = Object.keys(activeFilterValues).filter(
            key => activeFilterValues[key] && key !== 'typeAll' && key !== 'set'
        );
        const queryParams = types
            .map(v => {
                return v.replace('type', '').toLowerCase();
            })
            .join(',');
        url += `&types=${queryParams}`;
    }

    // fetch articles
    const articles = await fetch(url, {signal})
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            if (err.name === 'AbortError') {
                return; // ignore AbortError errors
            };
            console.error(err);
            return [];
        });

    return articles;
}
