import { addTabToGroup } from './tabGroup.js';
import { renderArticle } from './renderArticle.js';

// Parse a given article, sanitise content, format into HTML DOM content
export function parseResults(data, searchBarNamePrefix) {

    const articles = data.data;
    const searchTerm = data.search;
    const searchResultsDomElement = document.getElementById(`${searchBarNamePrefix}Results`);
    searchResultsDomElement.innerHTML = '';
    searchResultsDomElement.style.display = 'block';

    // Create a new list item for each article
    for (let i=0; i<articles.length; i++) {

        const article = articles[i];
        const listItemContainer = document.createElement('div');
        const listItemTitle = document.createElement('div');
        const listItemSubtitle = document.createElement('span');
        listItemTitle.innerHTML = article.title;
        listItemSubtitle.innerHTML = article.dateShortForm;
        listItemSubtitle.className = 'listItemSubtitle';
        listItemContainer.setAttribute('data-index', i);

        listItemContainer.addEventListener('click', async () => {

            document.getElementById('headSearchBarResults').style.display = 'none';
            document.getElementsByTagName('body')[0].style.backgroundImage = 'unset'; // remove background (png)
            addTabToGroup(article, searchTerm); // make new tab
            renderArticle(article, searchTerm) // render article
        });

        listItemContainer.append(listItemTitle, listItemSubtitle);
        searchResultsDomElement.appendChild(listItemContainer);
    };

    // create "x results" as last child
    const resultsCount = document.getElementById('searchResultsCount');
    resultsCount.innerHTML = `${articles.length} results`;

    if (data.data.length === 0) { // if no data is returned
        document.getElementById('noResultsFoundText').style.display = 'block';
        resultsCount.style.display = 'none';
        resultsCount.innerHTML = '';
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