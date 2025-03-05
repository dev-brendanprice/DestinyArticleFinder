import { isEntryValid } from './checkUserInput.js';
import { parseResults, clearResults } from './parseResults.js';
import { positions, whatDoWeCallThisFunction, cleanseHighlightedSpans } from './controlSearch.js';
import fetchResult from './fetchResult.js';

export default async function intializeEvents() {

    // Bungie logo redirect
    document.getElementById('bungieLogoIcon').addEventListener('click', () => window.open('https://www.bungie.net/7/en/News', '_blank').focus());
    const midSearchBar = document.getElementById('midSearchBar');
    const headSearchBar = document.getElementById('headSearchBar');
    let positionIndex = 0; // index for reader controls


    // Wrap check and fetch logic in nested function
    async function doFetch(element, type, callback) {

        const isValid = isEntryValid(element);
        const searchTerm = `${element.value}`;

        // Check if input is valid
        if (isValid) {
            const articles = await fetchResult(searchTerm);
            parseResults(articles, `${type}`);
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

        document.getElementById(`midSearchBarContainer`).style.borderBottomLeftRadius = '0px';
        document.getElementById(`midSearchBarContainer`).style.borderBottomRightRadius = '0px';
        document.getElementsByClassName(`spinner`)[0].style.opacity = '0.5';

        await doFetch(midSearchBar, 'midSearchBar', () => {
            document.getElementById(`midSearchBarContainer`).style.borderBottomLeftRadius = '5px';
            document.getElementById(`midSearchBarContainer`).style.borderBottomRightRadius = '5px';
        });

        document.getElementsByClassName(`spinner`)[0].style.opacity = '0';
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
    function toggleActiveHighlight() { // Toggle active highlighted-text

        // remove class from everything but matching index
        const target = positions[positionIndex].el;
        for (const item of positions) {
            item.el.className = 'highlight'; // remove class
        };
        target.className = 'activeHighlight';
    };

    // scroll to y pos on window
    function scrollToY(pos) {
        try {
            // Scroll to index of matching substring
            toggleActiveHighlight();
            window.scroll(0, pos.y);
        }
        catch (error) {
            console.error(error);
        };
    };


    // Event for reader control search query input -> index all text and reformat
    document.getElementById('controlSearchBar').addEventListener('keyup', async (event) => {

        let el = document.getElementById('articleContent');
        let searchBar = document.getElementById('controlSearchBar');
        let query = searchBar.value;

        // remove conflicting regex characters
        const confict = ['?', '/', '\\', '.', '(', ')', '[', ']', '{', '}', '$'];
        for (const char of confict) {
            query = query.replaceAll(char, '');
        };

        // entry is empty, remove all highlighting
        if (query.length === 0) {
            document.getElementById('controlSearchCountInner').style.display = 'none';
            document.getElementById('controlSearchCountDefault').style.display = 'flex';
            cleanseHighlightedSpans(el);
            return;
        };
        if (!isEntryValid(searchBar)) return; // return function if entry not valid

        whatDoWeCallThisFunction(el, query); // highlight and substring match
        
        // there are no matching substrings
        if (positions.length >= 1) {
            document.getElementById('controlSearchCountPrefix').innerHTML = 1;
            document.getElementById('controlSearchCountSuffix').innerHTML = positions.length;
            document.getElementById('controlSearchCountInner').style.display = 'flex';
            document.getElementById('controlSearchCountDefault').style.display = 'none';
        }
        else {
            document.getElementById('controlSearchCountInner').style.display = 'none';
            document.getElementById('controlSearchCountDefault').style.display = 'flex';
        };
    });


    // Event for reader control search query nav -> goes to previous index
    document.getElementById('controlButtonPrev').addEventListener('click', () => {

        // if first index, set to last
        if (positionIndex === 0) {
            positionIndex = positions.length - 1;
        }
        else {
            positionIndex--;
        };
        document.getElementById('controlSearchCountPrefix').innerHTML = positionIndex + 1; // ignore zero-based indexing

        // Scroll to index of matching substring
        const pos = positions[positionIndex];
        scrollToY(pos);
    });

    // Event for reader control search query nav -> goes to next index
    document.getElementById('controlButtonNext').addEventListener('click', () => {

        // if last index, set to first
        if (positionIndex === positions.length - 1) {
            positionIndex = 0;
        }
        else {
            positionIndex++;
        };
        document.getElementById('controlSearchCountPrefix').innerHTML = positionIndex + 1; // ignore zero-based indexing
        
        // Scroll to index of matching substring
        const pos = positions[positionIndex];
        scrollToY(pos);
    });
};