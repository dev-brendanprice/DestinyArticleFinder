import { getSearchStats } from './getSearchStats.js';
import { getSnippet } from './getSnippet.js';
import { mapArticleToRoute } from './handleRoutes.js';
import { renderArticle } from './renderArticle.js';
import { activeSortByValues } from './sortResults.js';
import { addTabToGroup, TabGroup } from './tabGroup.js';

// Parse a given article, sanitise content, format into HTML DOM content
export function parseResults(data) {
    const articles = data.data;
    const searchTerm = data.search;
    const searchResultsDomElement = document.getElementById(`searchBarResults`);
    searchResultsDomElement.innerHTML = '';
    searchResultsDomElement.style.display = 'block';

    function loadArticle(article, searchTerm) {
        document.getElementsByTagName('body')[0].style.backgroundImage = 'unset'; // remove background (png)
        addTabToGroup(article, searchTerm); // make new tab
        renderArticle(article, searchTerm); // render article
        mapArticleToRoute(article.hostedUrl, searchTerm);
    }

    // open link from href in new tab
    function openUrlOnElement(url) {
        window.open(url, '_blank').focus();
    }

    // handler to ensure unique click events
    function uniqueClickHandler(elementName, article, searchTerm) {

        const element = document.getElementById(`${elementName}`);
        const key = '_uniqueClickHandler_';

        if (element[key]) { // remove pre-existing events
            element.removeEventListener('click', element[key]);
        }
    
        element[key] = () => loadArticle(article, searchTerm); // new click handler
        element.addEventListener('click', element[key]);
    }

    // no articles are found with given searchTerm
    if (data.data.length === 0) {
        clearSearchBarResults();
        return;
    }

    // get search statistics for results
    const searchStatistics = getSearchStats(articles, searchTerm);
    const topArticle = searchStatistics.mostMentions[1]; // article with most matches
    const amountOfMatches = [...topArticle.htmlContent.matchAll(new RegExp(searchTerm, 'gi'))];
    // ^ amount of matches, in article with most matches

    // sort articles
    let sortBy = Object.keys(activeSortByValues)
        .filter(key => activeSortByValues[key] && key !== 'set')[0]
        .replace('type', '');

    if (sortBy === 'DateASC') {
        articles.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'DateDES') {
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'ABC') {
        articles.sort((a, b) => a.title.localeCompare(b.title));
    }

    console.log(searchStatistics);
    document.getElementById('statFirstDate').innerHTML = searchStatistics.firstMention.dateShortForm;
    document.getElementById('statLastDate').innerHTML = searchStatistics.lastMention.dateShortForm;
    document.getElementById('statMostDate').innerHTML = topArticle.dateShortForm;
    document.getElementById('statMostNumber').innerHTML = amountOfMatches.length;
    document.getElementById('statFirstTitle').innerHTML = searchStatistics.firstMention.title;
    document.getElementById('statLastTitle').innerHTML = searchStatistics.lastMention.title;
    document.getElementById('statMostTitle').innerHTML = topArticle.title;
    document.getElementById('statResults').innerHTML = articles.length;
    document.getElementById('statTotalMentions').innerHTML = searchStatistics.totalMentions;

    document.getElementById('statFirstBnet')
        .addEventListener('click', () => { openUrlOnElement(searchStatistics.firstMention.url); });
    document.getElementById('statLastBnet')
        .addEventListener('click', () => { openUrlOnElement(searchStatistics.lastMention.url); });
    document.getElementById('statMostBnet')
        .addEventListener('click', () => { openUrlOnElement(topArticle.url); });
    
    // assign unique click events for each of these elements
    uniqueClickHandler('statFirstTitle', searchStatistics.firstMention, searchTerm);
    uniqueClickHandler('statLastTitle', searchStatistics.lastMention, searchTerm);
    uniqueClickHandler('statMostTitle', topArticle, searchTerm);


    // Create a new list item for each article
    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const listItemContainer = document.createElement('a');
        const listItemTitle = document.createElement('div');
        const listItemSubtitle = document.createElement('span');
        const listItemSnippet = document.createElement('div');
        const snippet = getSnippet(article, searchTerm);

        // snippet can be a DOMElement or a String
        if (typeof snippet == 'string') {
            listItemSnippet.innerHTML = snippet;
        } else {
            listItemSnippet.appendChild(snippet);
        }

        listItemTitle.innerHTML = article.title;
        listItemSubtitle.innerHTML = article.dateShortForm;
        listItemSubtitle.className = 'listItemSubtitle';
        listItemSnippet.className = 'listItemSnippet';
        listItemContainer.href = `${window.location.origin}/article?a=${article.hostedUrl}&s=${searchTerm}`;
        listItemContainer.setAttribute('data-index', i);

        listItemContainer.addEventListener('click', async (e) => {
            e.preventDefault(); // stop default (href) behaviour on click
            document.getElementsByTagName('body')[0].style.backgroundImage = 'unset'; // remove background (png)
            document.getElementById('allResultsDropShadow').style.filter = 'drop-shadow(0px 0px 50px black)'; // add drop shadow back to search results
            addTabToGroup(article, searchTerm); // make new tab
            renderArticle(article, searchTerm); // render article
            mapArticleToRoute(article.hostedUrl, searchTerm);
        });

        listItemContainer.append(listItemTitle, listItemSnippet);
        searchResultsDomElement.appendChild(listItemContainer);
    }

    // show search stats
    document.getElementById('searchStatsContainer').style.display = 'flex';
    if (!(TabGroup.tabArticles.length >= 1)) {
        document.getElementById('allResultsDropShadow').style.filter = 'unset';
    }
}

// Clear results from a results container, via a specified parent-element
export function clearSearchBarResults() {
    const searchResultsElement = document.getElementById(`searchBarResults`);
    searchResultsElement.style.display = 'none';
    searchResultsElement.innerHTML = '';
    document.getElementById('searchStatsContainer').style.display = 'none';
}
