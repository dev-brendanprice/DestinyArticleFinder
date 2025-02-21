import variables from './config/variables.js';

// Tell server to return matching articles, using specified search term
export default async function fetchResult(searchTerm) {

    // console.log(`${variables.HOST}/api/data?search=sunshot`);
    // console.log(searchTerm);

    const articles = await fetch(`${variables.HOST}/api/data?search=${searchTerm}`)
        .then(res => res.json())
        .then(data => { return data });
    
    return articles;
};