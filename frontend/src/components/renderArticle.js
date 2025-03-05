import { positions, whatDoWeCallThisFunction } from './controlSearch.js';

export async function renderArticle(article, searchTerm) {

    // remove unnecessary text/attributes
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

    document.getElementById('articleControlsTitleText').innerHTML = `${article.title} (${article.dateShortForm})`;
    document.getElementById('articleTitle').innerHTML = article.title;
    document.getElementById('articleSubtitle').innerHTML = articleSubTitle;
    document.getElementById('articleContent').innerHTML = article.htmlContent;
    document.getElementById('articleTitleLink').addEventListener('click', () => window.open(article.url, '_blank').focus());
    console.log(article);

    // wait for iframes to load
    function iframesLoaded() {
        return new Promise((resolve, reject) => {

            // store to-be-loaded iframes
            let articleContainer = document.getElementById('articleContainer');
            let iframes = articleContainer.querySelectorAll('iframe');
            let elements = Array.from(iframes)//.concat(Array.from(images));
            if (elements.length === 0) {
                resolve();
                return;
            };
    
            let loadedCount = 0;
            elements.forEach((el) => { // wait for each element
    
                el.onload = () => {
                    loadedCount++;
                    if (loadedCount === elements.length) {
                        resolve();
                    };
                };
    
                el.onerror = () => {
                    reject(new Error('An element failed to load'));
                };
            });
        });
    };

    iframesLoaded().then(() => {
        console.log('🍒 (selected) resources loaded!');

        // highlight substrings, then show find function results
        whatDoWeCallThisFunction(document.getElementById('articleContent'), searchTerm);
        document.getElementById('controlSearchBar').value = `${searchTerm}`;

        // remove blur & load notice
        document.getElementById('articleControls').style.filter = 'none';
        document.getElementById('articleSubContainer').style.filter = 'none';
        document.getElementById('loadNoticeText').style.display = 'none';

        document.getElementById('controlSearchCountPrefix').innerHTML = 1;
        document.getElementById('controlSearchCountSuffix').innerHTML = positions.length;
        document.getElementById('controlSearchCountInner').style.display = 'flex';
        document.getElementById('controlSearchCountDefault').style.display = 'none';
    });
};

// reformat returned HTML content
// nuke this code; it's shit and not needed
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