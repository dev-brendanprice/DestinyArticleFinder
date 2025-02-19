import { isEntryValid } from './checkUserInput.js';
import { parseArticles, clearResults } from './parseArticles.js';
import { positions, whatDoWeCallThisFunction, cleanseHighlightedSpans } from './controlSearch.js';
import fetchResult from './fetch.js';


export default async function intializeEvents() {

    // Bungie logo redirect
    document.getElementById('bungieLogoIcon').addEventListener('click', () => window.open('https://www.bungie.net/7/en/News', '_blank').focus());
    const midSearchBar = document.getElementById('midSearchBar');
    const headSearchBar = document.getElementById('headSearchBar');


    // Wrap check and fetch logic in nested function
    async function doFetch(element, type, callback) {

        const isValid = isEntryValid(element);
        const searchTerm = `${element.value}`;

        // Check if input is valid
        if (isValid) {
            const articles = await fetchResult(searchTerm);
            parseArticles(articles, `${type}`);
        }
        else if (searchTerm.length === 0) {
            clearResults(`${type}`);
            callback();
        };
    };



    // Event for search bar located in the header, which is seen after the intial search query
    headSearchBar.addEventListener('keyup', async () => {
        await doFetch(headSearchBar, 'headSearchBar');
    });

    
    // Event for search bar the user initially sees
    midSearchBar.addEventListener('keyup', async () => {
        await doFetch(midSearchBar, 'midSearchBar', () => {
            document.getElementById(`midSearchBarContainer`).style.borderBottomLeftRadius = '5px';
            document.getElementById(`midSearchBarContainer`).style.borderBottomRightRadius = '5px';
        });
    });



    // Hide header search bar results when user clicks away
    document.addEventListener('mouseup', async (event) => {

        const headResultsContainer = document.getElementById('headSearchBarResults');
        const headSearchBar = document.getElementById('headSearchBar');

        // If click event target is NOT the head search bar, hide search results
        if (!headResultsContainer.contains(event.target)) {
            document.getElementById('headSearchBarResults').style.display = 'none';
        };

        // If click event target is the head search bar, show search results
        if (headSearchBar.contains(event.target) && headSearchBar.value.length !== 0) {
            document.getElementById('headSearchBarResults').style.display = 'block';
        };
    });



    // Nested function and index variable for reader controls
    let posIndex = 0;
    function toggleActiveHighlight() { // Toggle active highlighted-text

        // remove class from everything but matching index
        const target = positions[posIndex].el;
        for (const item of positions) {
            item.el.className = 'highlight'; // remove class
        };
        target.className = 'activeHighlight';
    };


    // Event for reader control search query input -> index all text and reformat
    document.getElementById('controlSearchBar').addEventListener('keyup', async (event) => {

        let el = document.getElementById('articleContent');
        let searchBar = document.getElementById('controlSearchBar');
        let query = searchBar.value;

        // remove conflicting regex characters
        query = query.replaceAll('?', '');
        query = query.replaceAll('/', '');
        query = query.replaceAll('\\', '');
        query = query.replaceAll('.', '');
        query = query.replaceAll('(', '');
        query = query.replaceAll(')', '');
        query = query.replaceAll('[', '');
        query = query.replaceAll(']', '');
        query = query.replaceAll('{', '');
        query = query.replaceAll('}', '');
        query = query.replaceAll('$', '');

        // entry is empty, remove all highlighting
        if (query.length === 0) {
            document.getElementById('controlSearchFeedbackResultsText').style.display = 'none';
            document.getElementById('controlSearchFeedbackDefaultText').style.display = 'flex';
            cleanseHighlightedSpans(el);
            return;
        };
        if (!isEntryValid(searchBar)) return; // return function if entry not valid

        whatDoWeCallThisFunction(el, query); // highlight and substring match
        
        // there are no matching substrings
        if (positions.length >= 1) {
            document.getElementById('controlSearchFeedbackResultFirst').innerHTML = 1;
            document.getElementById('controlSearchFeedbackResultSecond').innerHTML = positions.length;
            document.getElementById('controlSearchFeedbackResultsText').style.display = 'flex';
            document.getElementById('controlSearchFeedbackDefaultText').style.display = 'none';
        }
        else {
            document.getElementById('controlSearchFeedbackResultsText').style.display = 'none';
            document.getElementById('controlSearchFeedbackDefaultText').style.display = 'flex';
        };
    });


    // Event for reader control search query nav -> goes to previous index
    document.getElementById('controlButtonUp').addEventListener('click', () => {
        
        // If first index, set to last
        if (posIndex === 0) posIndex = positions.length-1;
        else posIndex--;
        document.getElementById('controlSearchFeedbackResultFirst').innerHTML = posIndex+1;

        try {
            // Scroll to index of matching substring
            const pos = positions[posIndex];
            toggleActiveHighlight();
            window.scroll(0, pos.y);
        }
        catch (error) { console.error(error) };
    });

    // Event for reader control search query nav -> goes to next index
    document.getElementById('controlButtonDown').addEventListener('click', () => {

        // If last index, set to first
        if (posIndex === positions.length-1) posIndex = 0;
        else posIndex++;
        document.getElementById('controlSearchFeedbackResultFirst').innerHTML = posIndex+1;
        

        try {
            // Scroll to index of matching substring
            const pos = positions[posIndex];
            toggleActiveHighlight();
            window.scroll(0, pos.y);
        }
        catch (error) { console.error(error) };
    });

    console.log('Events intialized');
};