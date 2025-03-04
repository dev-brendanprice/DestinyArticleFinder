import variables from './config/variables.js';

// Tell server to return matching articles, using specified search term
export default async function fetchResult(searchTerm) {

    const articles = await fetch(`${variables.HOST}/api/v1/articles?search=${searchTerm}`)
        .then(res => res.json())
        .then(data => { return data });
    
    return articles;
};