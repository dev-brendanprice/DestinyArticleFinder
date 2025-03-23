import { variables, activeFilterValues } from './config/variables.js';

// Tell server to return matching articles, using specified search term
export default async function fetchResult(searchTerm) {

    let url = `${variables.HOST}/api/v1/articles?search=${encodeURIComponent(searchTerm)}`;

    if (!activeFilterValues.typeAll) {

        const types = Object.keys(activeFilterValues).filter(key => activeFilterValues[key] && key !== 'typeAll' && key !== 'set');
        const queryParams = types.map(v => { return v.replace('type', '').toLowerCase() }).join(',');
        url += `&types=${queryParams}`;
    };

    const articles = await fetch(url)
        .then(res => res.json())
        .then(data => { return data })
        .catch(err => {
            console.error(err);
            return [];
        });
    
    return articles;
};