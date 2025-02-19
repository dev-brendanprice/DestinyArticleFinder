
// Tell server to return matching articles, using specified search term
export default async function fetchResult(searchTerm) {
    const articles = await fetch(`/api/data?search=${searchTerm}`)
    .then(response => response.json())
    .then(data => { return data }).catch(console.error);
    return articles;
};