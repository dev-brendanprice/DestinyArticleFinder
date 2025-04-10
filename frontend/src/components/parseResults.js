import { activeSortByValues } from './config/variables.js';
import { getSearchStats } from './getSearchStats.js';
import { getSnippet } from './getSnippet.js';
import { mapArticleToRoute } from './handleRoutes.js';
import { renderArticle } from './renderArticle.js';
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

    function openUrlOnElement(e) {
        e.preventDefault();
        window.open(e.target.href, '_blank').focus();
    }

    // no articles are found with given searchTerm
    if (data.data.length === 0) {
        clearSearchBarResults();
        return;
    }

    // get search statistics for results, by searching for occurences of substring, etc.
    const searchStatistics = getSearchStats(articles, searchTerm);
    const mostMatches = [...searchStatistics.mostMentions[1].htmlContent.matchAll(new RegExp(searchTerm, 'gi'))];

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
    document.getElementById('statMostDate').innerHTML = searchStatistics.mostMentions[1].dateShortForm;
    document.getElementById('statMostNumber').innerHTML = mostMatches.length;

    document.getElementById('statFirstTitle').innerHTML = searchStatistics.firstMention.title;
    document.getElementById('statLastTitle').innerHTML = searchStatistics.lastMention.title;
    document.getElementById('statMostTitle').innerHTML = searchStatistics.mostMentions[1].title;
    document.getElementById('statFirstBnet').href = searchStatistics.firstMention.url;
    document.getElementById('statLastBnet').href = searchStatistics.lastMention.url;
    document.getElementById('statMostBnet').href = searchStatistics.mostMentions[1].url;
    document.getElementById('statFirstBnet').addEventListener('click', openUrlOnElement);
    document.getElementById('statLastBnet').addEventListener('click', openUrlOnElement);
    document.getElementById('statMostBnet').addEventListener('click', openUrlOnElement);

    document
        .getElementById('statFirstTitle')
        .addEventListener('click', () => loadArticle(searchStatistics.firstMention, searchTerm));
    document
        .getElementById('statLastTitle')
        .addEventListener('click', () => loadArticle(searchStatistics.lastMention, searchTerm));
    document
        .getElementById('statMostTitle')
        .addEventListener('click', () => loadArticle(searchStatistics.mostMentions[1], searchTerm));

    document.getElementById('statResults').innerHTML = articles.length;
    document.getElementById('statTotalMentions').innerHTML = searchStatistics.totalMentions;

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
