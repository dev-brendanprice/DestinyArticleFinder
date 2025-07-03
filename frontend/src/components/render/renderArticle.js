import { highlightSubstringPositions, positions } from '../search/controlSearch.js';
import { addImageControls } from '../ui/addImageControls.js';
import { waitForQueriesToLoad } from '../ui/mediaHandler.js';
import { parseDOM } from './parseDOM.js';

export async function renderArticle(article, searchTerm) {

    let articleContent = article.htmlContent;

    articleContent = parseDOM(articleContent);
    // articleContent = uwufyHTML(articleContent);
    // document.getElementById('articleTitle').innerHTML = uwufyString(article.title) + articleLinkSVG;
    // document.getElementById('articleSubtitle').innerHTML = uwufyString(articleSubTitle);
    document.getElementById('searchStatsContainer').style.display = 'none';
    document.getElementById('searchResultsContainer').style.display = 'none';
    document.getElementById('bodyBlur').style.display = 'none';
    document.getElementById('sliderConOuter').style.display = 'none';
    document.getElementById('articleMainContainer').style.display = 'flex';
    document.getElementById('articleControlsTitleText').innerHTML = `${article.title} (${article.dateShortForm})`;
    document.getElementById('articleTitle').innerHTML = article.title;
    document.getElementById('articlePublished').innerHTML = article.dateShortForm;
    document.getElementById('articleAuthor').innerHTML = article.author;
    document.getElementById('articleContent').innerHTML = articleContent;
    document.getElementById('articleOriginLink')
        .addEventListener('click', () => window.open(article.url, '_blank').focus());
    

    // if imgUrl is null, hide image
    if (!article.imgUrl) {
        document.getElementById('articleImgHeader').style.display = 'none';
    } else {
        document.getElementById('articleImgHeader').src = article.imgUrl.trim();
    };

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
