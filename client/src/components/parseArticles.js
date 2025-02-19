import { positions, whatDoWeCallThisFunction } from './controlSearch.js';

// tabGroup object with getter/setter functions
const tabGroup = {

    tabArticles: [],
    currentTabIndex: 0, // used to distinguish tabs

    addTab(article, searchTerm) {
        this.tabArticles.push({article: article, search: searchTerm});
    },
    removeTab(index) {
        this.tabArticles.splice(index, 1);
    }
};

function addTabToGroup(article, searchTerm) {

    tabGroup.addTab(article, searchTerm); // Add tab to array
    const tabObjLength = Object.keys(tabGroup.tabArticles).length;
    const newTab = document.createElement('div');
    const tabTitle = document.createElement('div');
    const tabCloseButton = document.createElement('img');

    newTab.classList.add('activeTab');
    newTab.id = 'tabItem';
    tabTitle.id = 'tabTitle';
    tabCloseButton.id = 'btnCloseTab';

    tabTitle.innerHTML = `${article.type.toUpperCase()}, "${searchTerm}"`;
    tabCloseButton.src = './assets/button_close.svg';

    newTab.append(tabCloseButton, tabTitle);
    newTab.setAttribute('data-tabIndex', tabObjLength);
    tabGroup.currentTabIndex = tabGroup.currentTabIndex+1;

    // remove activeTab class from all tabs
    const tabGroupContainer = document.getElementById('tabGroupContainer');
    for (let child of tabGroupContainer.children) {
        child.removeAttribute('class');
    };
    
    tabGroupContainer.appendChild(newTab);

    // ..
    tabCloseButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTabFromGroup(e)
    });
    newTab.addEventListener('click', (e) => {

        const tabContainer = e.target;
        const tabGroupContainer = tabContainer.parentElement;

        for (let child of tabGroupContainer.children) {
            child.removeAttribute('class');
        };
        tabContainer.classList.add('activeTab');

        const selectedTabIndex = parseInt(newTab.getAttribute('data-tabIndex'));
        if (selectedTabIndex !== tabGroup.currentTabIndex) {
            tabGroup.currentTabIndex = selectedTabIndex;
            renderArticle(article, searchTerm);
        };
    });
};

function removeTabFromGroup(e) {

    const tabContainer = e.target.parentElement;
    const tabGroupContainer = tabContainer.parentElement;
    const tabIndex = parseInt(tabContainer.getAttribute('data-tabIndex'))-1;

    tabGroup.currentTabIndex = tabIndex;
    tabGroup.removeTab(tabIndex); // remove tab from array
    tabContainer.remove(); // remove tab from DOM
    if (tabGroup.tabArticles.length === 0) location.reload(); // if no tabs left

    // assign activeTab class to now-open tab
    for (let child of tabGroupContainer.children) {
        child.removeAttribute('class');
    };
    tabGroupContainer.children[0].className = 'activeTab';
    
    // reassign data-tabIndex indexes
    for (let i=0; i<tabGroupContainer.children.length; i++) {
        const child = tabGroupContainer.children[i];
        child.setAttribute('data-tabIndex', i+1);
    };

    renderArticle(tabGroup.tabArticles[0].article);
};


// Parse a given article, sanitise content, format into HTML DOM content
export function parseArticles(data, searchBarNamePrefix) {

    const articles = data.data;
    const searchTerm = data.search;

    const searchResultsDomElement = document.getElementById(`${searchBarNamePrefix}Results`);
    searchResultsDomElement.innerHTML = '';
    searchResultsDomElement.style.display = 'block';

    if (searchBarNamePrefix == 'midSearchBar') {
        document.getElementById(`${searchBarNamePrefix}`).style.borderBottomLeftRadius = '0px';
        document.getElementById(`${searchBarNamePrefix}`).style.borderBottomRightRadius = '0px';
    };

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
    else document.getElementById('noResultsFoundText').style.display = 'none';
};


// Clear results from a results container, via a specified parent-element
export function clearResults(searchBarNamePrefix) {
    const searchResultsDomElement = document.getElementById(`${searchBarNamePrefix}Results`);
    searchResultsDomElement.style.display = 'none';
    searchResultsDomElement.innerHTML = '';
};


async function renderArticle(article, searchTerm) {

    const articleSubTitle = article.dateShortForm + ' - ' + article.author;
    article.htmlContent = removeDataAttrs(article.htmlContent, 'img');
    article.htmlContent = removeDataAttrs(article.htmlContent, 'iframe');
    article.htmlContent = removeDataAttrs(article.htmlContent, 'a');
    article.htmlContent = addIdToTags(article.htmlContent, 'img', 'articleImage');
    article.htmlContent = addIdToTags(article.htmlContent, 'iframe', 'articleIframe');
    article.htmlContent = addIdToTags(article.htmlContent, 'iframe', 'articleTagA');

    document.getElementById('midContainer').style.display = 'none';
    document.getElementById('headSearchBarContainer').style.display = 'flex';
    document.getElementById('articleMainContainer').style.display = 'flex';
    document.getElementById('articleTitle').innerHTML = article.title;
    document.getElementById('articleSubtitle').innerHTML = articleSubTitle;
    document.getElementById('articleContent').innerHTML = article.htmlContent;
    document.getElementById('articleTitleLink').addEventListener('click', () => window.open(article.url, '_blank').focus());

    // Drop-in AI code -> Promise await iframes loading (REFACTOR ME)
    function iframesLoaded() {
        return new Promise((resolve, reject) => {

            let iframes = document.querySelectorAll('iframe');
            if (iframes.length === 0) {
                resolve();
                return;
            };
    
            let loadedCount = 0;
            iframes.forEach((iframe) => {
    
                iframe.onload = () => {
                    loadedCount++;
                    if (loadedCount === iframes.length) {
                        resolve();
                    };
                };
    
                iframe.onerror = () => {
                    reject(new Error('An iframe failed to load'));
                };
            });
        });
    };

    iframesLoaded().then(() => {
        console.log('🍒 iframes loaded!');

        // highlight substrings, then show find function results
        whatDoWeCallThisFunction(document.getElementById('articleContent'), searchTerm);
        document.getElementById('controlSearchBar').value = `${searchTerm}`;

        // remove blur & load notice
        document.getElementById('articleControls').style.filter = 'none';
        document.getElementById('articleSubContainer').style.filter = 'none';
        document.getElementById('loadNoticeText').style.display = 'none';

        document.getElementById('controlSearchFeedbackResultFirst').innerHTML = 1;
        document.getElementById('controlSearchFeedbackResultSecond').innerHTML = positions.length;
        document.getElementById('controlSearchFeedbackResultsText').style.display = 'flex';
        document.getElementById('controlSearchFeedbackDefaultText').style.display = 'none';
    });
};


// reformat returned HTML content
function removeDataAttrs(htmlContent) {
    const pattern = /\s*asset_uid="[^"]*"/gi;
    const modifiedContent = htmlContent.replace(pattern, '');
    return modifiedContent;
};

function addIdToTags(htmlContent, tagName, idName) {
    const pattern = new RegExp(`<${tagName}([^>]*)>`, 'gi');
    const addId = (match, attrs) => {
        if (/id\s*=\s*['"]?[^'"]*['"]?/.test(attrs)) {
            return match;
        };
        return `<${tagName} id="${idName}"${attrs}>`;
    };

    const modifiedContent = htmlContent.replace(pattern, addId);
    return modifiedContent;
};