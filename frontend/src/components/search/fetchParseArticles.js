import { resetPositionIndex } from "../core/initEvents.js";
import { clearSearchBarResults, parseResults } from "../render/parseResults.js";
import { isEntryValid } from "./checkUserInput.js";
import { fetchArticles } from "./fetchArticles.js";

// check search bar value then fetch and parse articles
export async function fetchAndParseArticles(isResend, silent = false) {
    const searchBar = document.getElementById('searchBar');
    const isValid = isEntryValid(searchBar, isResend);
    const searchTerm = `${searchBar.value}`;

    if (searchTerm.length === 0) {
        clearSearchBarResults('searchBar');
        return;
    }

    // Check if input is valid
    if (isValid) {
        document.getElementsByClassName(`spinner`)[0].style.opacity = '0.5';
        const articles = await fetchArticles(searchTerm);
        if (!articles) { return; } // if guard -> fetchArticles return undefined with AbortController

        // hides result list by default, unless they are meant to be loaded in the background
        if (silent === false) {
            document.getElementById('searchStatsContainer').style.display = 'flex';
            document.getElementById('searchResultsContainer').style.display = 'flex';
            document.getElementById('bodyBlur').style.display = 'block';
        };
        
        parseResults(articles);
        resetPositionIndex();
        document.getElementsByClassName(`spinner`)[0].style.opacity = '0';
    }
}