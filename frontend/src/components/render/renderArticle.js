import { highlightSubstringPositions, positions } from '../search/controlSearch.js';
import { addImageControls } from '../ui/addImageControls.js';
import { waitForQueriesToLoad } from '../ui/mediaHandler.js';
import { parseDOM } from './parseDOM.js';

export async function renderArticle(article, searchTerm) {
    // remove unnecessary text/attributes
    const articleSubTitle = article.dateShortForm + ' - ' + article.author;
    const articleLinkSVG = '<svg id="articleTitleLink" viewBox="0 0 16 16" height="16" aria-hidden="true"><path fill="#8585C5" d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg>';
    let articleContent = article.htmlContent;


    articleContent = parseDOM(articleContent);
    // articleContent = uwufyHTML(articleContent);
    document.getElementById('searchStatsContainer').style.display = 'none';
    document.getElementById('searchResultsContainer').style.display = 'none';
    document.getElementById('bodyBlur').style.display = 'none';
    document.getElementById('sliderConOuter').style.display = 'none';
    document.getElementById('articleMainContainer').style.display = 'flex';
    document.getElementById('articleControlsTitleText').innerHTML = `${article.title} (${article.dateShortForm})`;
    document.getElementById('articleTitle').innerHTML = article.title + articleLinkSVG;
    document.getElementById('articleSubtitle').innerHTML = articleSubTitle;
    // document.getElementById('articleTitle').innerHTML = uwufyString(article.title) + articleLinkSVG;
    // document.getElementById('articleSubtitle').innerHTML = uwufyString(articleSubTitle);
    document.getElementById('articleContent').innerHTML = articleContent;
    document
        .getElementById('articleTitleLink')
        .addEventListener('click', () => window.open(article.url, '_blank').focus());

    addImageControls(); // buttons for like "Copy Image", "Download", etc.

    // if searchTerm present, highlight substrings then show find function results
    if (searchTerm !== '') {
        highlightSubstringPositions(document.getElementById('articleContent'), searchTerm);
        document.getElementById('controlSearchBar').value = `${searchTerm}`;
    };


    waitForQueriesToLoad('img')
        .then(() => {
            console.log('🍒 images loaded!');
        })
        .catch(console.error);

    waitForQueriesToLoad('iframe') // may need to nuke this code
        .then(() => {
            console.log('🍒 iframes loaded!');

            // remove blur & load notice
            document.getElementById('articleControls').style.filter = 'none';
            document.getElementById('articleContainer').style.filter = 'none';
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
        })
        .catch(console.error);
}
