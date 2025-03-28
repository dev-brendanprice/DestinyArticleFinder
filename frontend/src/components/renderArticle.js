import { addImageControls } from './addImageControls.js';
import { highlightSubstringPositions, positions } from './controlSearch.js';
import { parseDOM } from './parseDOM.js';

export async function renderArticle(article, searchTerm) {
    // remove unnecessary text/attributes
    const articleSubTitle = article.dateShortForm + ' - ' + article.author;
    let articleContent = article.htmlContent;

    articleContent = parseDOM(articleContent);
    document.getElementById('searchResultsContainer').style.display = 'none';
    document.getElementById('articleMainContainer').style.display = 'flex';
    document.getElementById('articleControlsTitleText').innerHTML = `${article.title} (${article.dateShortForm})`;
    document.getElementById('articleTitle').innerHTML = article.title;
    document.getElementById('articleSubtitle').innerHTML = articleSubTitle;
    document.getElementById('articleContent').innerHTML = articleContent;
    document
        .getElementById('articleTitleLink')
        .addEventListener('click', () => window.open(article.url, '_blank').focus());

    addImageControls(); // buttons for like "Copy Image", "Download", etc.

    // highlight substrings, then show find function results
    highlightSubstringPositions(document.getElementById('articleContent'), searchTerm);
    document.getElementById('controlSearchBar').value = `${searchTerm}`;

    // wait for iframes to load
    function iframesLoaded() {
        return new Promise((resolve, reject) => {
            // store to-be-loaded iframes
            const articleContainer = document.getElementById('articleContainer');
            const iframes = articleContainer.querySelectorAll('iframe');
            const elements = Array.from(iframes);
            if (elements.length === 0) {
                resolve();
                return;
            }

            let loadedCount = 0;
            elements.forEach(el => {
                // wait for each element

                el.onload = () => {
                    loadedCount++;
                    if (loadedCount === elements.length) {
                        resolve();
                    }
                };

                el.onerror = () => {
                    reject(new Error('An element failed to load'));
                };
            });
        });
    }

    iframesLoaded().then(() => {
        console.log('🍒 (selected) resources loaded!');

        // remove blur & load notice
        document.getElementById('articleControls').style.filter = 'none';
        document.getElementById('articleSubContainer').style.filter = 'none';
        document.getElementById('loadNoticeText').style.display = 'none';

        // show find function results
        if (positions.length === 0) {
            document.getElementById('controlSearchCountInner').style.display = 'none';
            document.getElementById('controlSearchCountDefault').style.display = 'flex';
        } else {
            document.getElementById('controlSearchCountPrefix').innerHTML = 1;
            document.getElementById('controlSearchCountSuffix').innerHTML = positions.length;
            document.getElementById('controlSearchCountInner').style.display = 'flex';
            document.getElementById('controlSearchCountDefault').style.display = 'none';
        }
    });
}
