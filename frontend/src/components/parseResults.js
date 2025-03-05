import { addTabToGroup } from './tabGroup.js';
import { renderArticle } from './renderArticle.js';

// Parse a given article, sanitise content, format into HTML DOM content
export function parseResults(data, searchBarNamePrefix) {

    const articles = data.data;
    const searchTerm = data.search;
    const searchResultsDomElement = document.getElementById(`${searchBarNamePrefix}Results`);
    searchResultsDomElement.innerHTML = '';
    searchResultsDomElement.style.display = 'block';

    // if (searchBarNamePrefix == 'midSearchBar') {
    //     document.getElementById(`${searchBarNamePrefix}`).style.borderBottomLeftRadius = '0px';
    //     document.getElementById(`${searchBarNamePrefix}`).style.borderBottomRightRadius = '0px';
    // };

    for (let i=0; i<articles.length; i++) {

        const article = articles[i];
        const newDomElement = document.createElement('div');
        newDomElement.innerHTML = article.title;
        newDomElement.setAttribute('data-index', i);

        newDomElement.addEventListener('click', async () => {

            document.getElementById('headSearchBarResults').style.display = 'none';
            addTabToGroup(article, searchTerm); // make new tab
            renderArticle(article, searchTerm) // render article
        });
        searchResultsDomElement.appendChild(newDomElement);
    };

    if (data.data.length === 0) { // if no data is returned
        document.getElementById('noResultsFoundText').style.display = 'block';
        clearResults(searchBarNamePrefix);
    }
    else {
        document.getElementById('noResultsFoundText').style.display = 'none';
    };
};


// Clear results from a results container, via a specified parent-element
export function clearResults(searchBarNamePrefix) {
    const searchResultsDomElement = document.getElementById(`${searchBarNamePrefix}Results`);
    searchResultsDomElement.style.display = 'none';
    searchResultsDomElement.innerHTML = '';
};