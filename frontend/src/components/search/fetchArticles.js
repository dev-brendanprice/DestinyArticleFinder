import { API_HOST } from '../../index.js';
import { activeFilterValues } from './filterResults.js';

// fetch articles by name (hostedUrl) from server
export async function fetchArticlesByName(articleNames) {
    let url = `${API_HOST}/api/v1/articlesByName?a=${articleNames}`;

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
    let url = `${API_HOST}/api/v1/articles?search=${encodeURIComponent(searchTerm)}`;

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
