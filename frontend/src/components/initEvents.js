import { isEntryValid } from './checkUserInput.js';
import { activeFilterValues, activeSortByValues } from './config/variables.js';
import {
    cleanseHighlightedSpans,
    clearPositions,
    highlightSubstringPositions,
    positions,
    toggleCaseSensitive
} from './controlSearch.js';
import fetchResult from './fetchResult.js';
import { clearResults, parseResults } from './parseResults.js';

export default async function intializeEvents() {
    const searchBarElement = document.getElementById('searchBar');
    let positionIndex = 0; // index for reader controls

    // Wrap check and fetch logic in nested function
    async function doFetch(callback, isResend = false) {
        const searchBar = document.getElementById('searchBar');
        const isValid = isEntryValid(searchBar, isResend);
        const searchTerm = `${searchBar.value}`;

        // Check if input is valid
        if (isValid) {
            const articles = await fetchResult(searchTerm);
            document.getElementById('searchResultsContainer').style.display = 'flex';
            document.getElementById('searchResultsCount').style.display = 'flex';
            parseResults(articles, 'searchBar');
            positionIndex = 0; // reset index
        } else if (searchTerm.length === 0) {
            clearResults('searchBar');
            callback();
        }
    }

    // Bungie logo redirect
    document.getElementById('bungieLogoIcon').addEventListener('click', () => {
        window.open('https://www.bungie.net/7/en/News', '_blank').focus();
    });

    // Event for search bar the user initially sees
    searchBarElement.addEventListener('keyup', async () => {
        document.getElementsByClassName(`spinner`)[0].style.opacity = '0.5';
        await doFetch(() => {
            document.getElementById('searchResultsCount').style.display = 'none';
        });
        document.getElementsByClassName(`spinner`)[0].style.opacity = '0';
    });

    // do this but for "esc" key press too
    // hide certain elements when user clicks away
    document.addEventListener('mouseup', async event => {
        const targetClass = event.target.className;
        const targetClassList = targetClass.split(' ');

        // hide search bar results
        // document.getElementById('searchResultsContainer').style.display = 'none';

        // for image "More" context menu
        if (targetClass !== 'imageCtrlInner') {
            const ctrlMoreContainers = document.getElementsByClassName('ctrlMoreContainer');
            Array.prototype.forEach.call(ctrlMoreContainers, el => {
                el.style.display = 'none';
            });

            const imageCtrlElements = document.getElementsByClassName('imageCtrl');
            Array.prototype.forEach.call(imageCtrlElements, el => {
                el.style.backgroundColor = '';
            });

            const imageControlElements = document.getElementsByClassName('imageControls');
            Array.prototype.forEach.call(imageControlElements, el => {
                el.style.opacity = '';
            });
        }

        // hide when clicking away from filter/sort-by lists
        if (!targetClassList.includes('filterItem')) {
            hideFilterList();
        }
        if (!targetClassList.includes('sortbyItem')) {
            hideSortList();
        }
    });

    // Nested function and index variable for reader controls
    function toggleActiveHighlight() {
        // Toggle active highlighted-text

        // remove class from everything but matching index
        const target = positions[positionIndex].el;
        for (const item of positions) {
            item.el.className = 'highlight'; // remove class
        }
        target.className = 'activeHighlight';
    }

    // scroll to y pos on window
    function scrollToY(pos) {
        try {
            // Scroll to index of matching substring
            toggleActiveHighlight();
            window.scroll(0, pos.y);
        } catch (error) {
            console.error(error);
        }
    }

    // Event for reader control search query input -> index all text and reformat
    document.getElementById('controlSearchBar').addEventListener('keyup', async () => {
        const articleElement = document.getElementById('articleContent');
        const searchBar = document.getElementById('controlSearchBar');
        let searchQuery = searchBar.value;

        // remove conflicting regex characters
        const confict = ['?', '/', '\\', '.', '(', ')', '[', ']', '{', '}', '$'];
        for (const char of confict) {
            searchQuery = searchQuery.replaceAll(char, '');
        }

        // check entry validity
        if (!isEntryValid(searchBar)) {
            // string has changed

            if (searchQuery.length === 0) {
                // string is not empty
                clearPositions();
                cleanseHighlightedSpans(articleElement);
                document.getElementById('controlSearchCountInner').style.display = 'none';
                document.getElementById('controlSearchCountDefault').style.display = 'flex';
            }
            return;
        }

        highlightSubstringPositions(articleElement, searchQuery); // substring highlighting

        // one or more matching substrings
        if (positions.length >= 1) {
            document.getElementById('controlSearchCountPrefix').innerHTML = 1;
            document.getElementById('controlSearchCountSuffix').innerHTML = positions.length;
            document.getElementById('controlSearchCountInner').style.display = 'flex';
            document.getElementById('controlSearchCountDefault').style.display = 'none';
        } else if (positions.length === 0) {
            document.getElementById('controlSearchCountInner').style.display = 'none';
            document.getElementById('controlSearchCountDefault').style.display = 'flex';
        }
    });

    // toggle case sensitivity
    const caseSensitiveToggle = document.getElementById('controlSearchCaseSensitiveToggle');
    caseSensitiveToggle.addEventListener('click', () => {
        const searchBar = document.getElementById('controlSearchBar');
        caseSensitiveToggle.classList.toggle('controlSearchCaseSensitiveToggleActive');

        positionIndex = 0; // reset index
        toggleCaseSensitive();
        highlightSubstringPositions(document.getElementById('articleContent'), searchBar.value);

        // no matching substrings
        if (positions.length === 0) {
            positionIndex = 0;
            document.getElementById('controlSearchCountInner').style.display = 'none';
            document.getElementById('controlSearchCountDefault').style.display = 'flex';
            return;
        }

        document.getElementById('controlSearchCountInner').style.display = 'flex';
        document.getElementById('controlSearchCountDefault').style.display = 'none';
        document.getElementById('controlSearchCountPrefix').innerHTML = positionIndex + 1;
        document.getElementById('controlSearchCountSuffix').innerHTML = positions.length;
    });

    // Event for reader control search query nav -> goes to previous index
    document.getElementById('controlButtonPrev').addEventListener('click', () => {
        if (positions.length === 0) {
            return;
        }

        // if first index, set to last
        if (positionIndex === 0) {
            positionIndex = positions.length - 1;
        } else {
            positionIndex--;
        }
        document.getElementById('controlSearchCountPrefix').innerHTML = positionIndex + 1; // ignore zero-based indexing

        // Scroll to index of matching substring
        const pos = positions[positionIndex];
        scrollToY(pos);
    });

    // Event for reader control search query nav -> goes to next index
    document.getElementById('controlButtonNext').addEventListener('click', () => {
        if (positions.length === 0) {
            return;
        }

        // if last index, set to first
        if (positionIndex === positions.length - 1) {
            positionIndex = 0;
        } else {
            positionIndex++;
        }
        document.getElementById('controlSearchCountPrefix').innerHTML = positionIndex + 1;

        // Scroll to index of matching substring
        const pos = positions[positionIndex];
        scrollToY(pos);
    });

    // search filter list
    const filterParent = document.getElementById('filterFold');
    let filtersOpen = false;
    filterParent.addEventListener('click', () => {
        const listItems = document.getElementsByClassName('fli');
        let displayMode = 'none';

        // parent style
        if (filtersOpen) {
            // console.log('close');
            filterParent.style.borderBottomRightRadius = '5px';
            filterParent.style.borderBottomLeftRadius = '5px';
            filtersOpen = false;
        } else if (!filtersOpen) {
            // console.log('open');
            filterParent.style.borderBottomRightRadius = '0px';
            filterParent.style.borderBottomLeftRadius = '0px';
            filtersOpen = true;
            displayMode = 'flex';
        }

        // hide list items
        for (let item of listItems) {
            item.style.display = displayMode;
        }
    });

    // search sort-by list
    const sortbyParent = document.getElementById('sortbyFold');
    let sortbyOpen = false;
    sortbyParent.addEventListener('click', () => {
        const listItems = document.getElementsByClassName('sli');
        let displayMode = 'none';

        if (sortbyOpen) {
            displayMode = 'none';
            sortbyParent.style.borderBottomRightRadius = '5px';
            sortbyParent.style.borderBottomLeftRadius = '5px';
            sortbyOpen = false;
        } else if (!sortbyOpen) {
            displayMode = 'flex';
            sortbyParent.style.borderBottomRightRadius = '0px';
            sortbyParent.style.borderBottomLeftRadius = '0px';
            sortbyOpen = true;
        }

        for (let item of listItems) {
            item.style.display = displayMode;
        }
    });

    // filter list items
    const filterListItems = document.getElementsByClassName('fli');
    const filterListValues = ['typeTwab', 'typeNews', 'typeUpdate', 'typeHotfix'];
    const typeAllCheckbox = document.querySelector('[value=typeAll]');
    const getCheckbox = value => document.querySelector(`[value=${value}]`);

    function hideFilterList() {
        filterParent.style.borderBottomRightRadius = '5px';
        filterParent.style.borderBottomLeftRadius = '5px';

        for (let item of filterListItems) {
            item.style.display = 'none';
        }

        filtersOpen = false;
    }

    function getActiveFilterCount() {
        return filterListValues.filter(key => activeFilterValues[key]).length;
    }

    // event listener for each list item
    for (const listItem of filterListItems) {
        listItem.addEventListener('click', async () => {
            const checkbox = listItem.querySelector('input');
            const checkboxValue = checkbox.value;

            if (checkboxValue !== 'typeAll') {
                const newState = !checkbox.checked;
                checkbox.checked = newState;
                activeFilterValues.set(checkboxValue, newState);

                const activeCount = getActiveFilterCount();

                if (activeCount === filterListValues.length) {
                    // Reset individual filters and enable 'typeAll'
                    filterListValues.forEach(val => {
                        getCheckbox(val).checked = false;
                        activeFilterValues.set(val, false);
                    });
                    typeAllCheckbox.checked = true;
                    activeFilterValues.set('typeAll', true);
                } else {
                    typeAllCheckbox.checked = false;
                    activeFilterValues.set('typeAll', false);
                }

                if (activeCount === 0) {
                    typeAllCheckbox.checked = true;
                    activeFilterValues.set('typeAll', true);
                }

                hideFilterList();
            } else if (checkboxValue === 'typeAll' && getActiveFilterCount() > 0) {
                filterListValues.forEach(val => {
                    getCheckbox(val).checked = false;
                    activeFilterValues.set(val, false);
                });
                typeAllCheckbox.checked = true;
                activeFilterValues.set('typeAll', true);
                hideFilterList();
            }

            // transform active filter values into a comma-seperated string
            // e.g. key = 'typeUpdate', value = true
            let filtersString = Object.entries(activeFilterValues)
                .filter(([key, value]) => value && key !== 'typeAll' && key !== 'set')
                .map(([key]) => {
                    key = key.replace(/^type/, '');
                    if (key === 'Hotfix') key += 'es';
                    if (key === 'Update') key += 's';
                    return key;
                })
                .join(',');

            if (filtersString.length === 0) filtersString = 'All (default)';
            document.getElementById('filterParentLabel').innerHTML = filtersString;

            // search for articles again
            document.getElementsByClassName(`spinner`)[0].style.opacity = '0.5';
            await doFetch(() => {
                document.getElementById('searchResultsCount').style.display = 'none';
            }, true);
            document.getElementsByClassName(`spinner`)[0].style.opacity = '0';
        });
    }

    // sort-by list items
    const sortByListItems = document.getElementsByClassName('sli');
    const sortByValues = ['typeDateASC', 'typeDateDES', 'typeABC'];
    const getSortCheckbox = value => document.querySelector(`[value=${value}]`);

    // hide list after click
    function hideSortList() {
        sortbyParent.style.borderBottomRightRadius = '5px';
        sortbyParent.style.borderBottomLeftRadius = '5px';

        for (let item of sortByListItems) {
            item.style.display = 'none';
        }

        sortbyOpen = false;
    }

    // assign listener to each list item
    for (let listItem of sortByListItems) {
        listItem.addEventListener('click', async () => {
            // radio checkbox (only one in list can be active)
            const checkbox = listItem.querySelector('input');
            const checkboxValue = checkbox.value;

            // only change if clicked checkbox is false
            if (!checkbox.checked) {
                // set all to false
                for (const value of sortByValues) {
                    const checkbox = getSortCheckbox(value);
                    checkbox.checked = false;
                    activeSortByValues.set(value, false);
                }

                checkbox.checked = true;
                activeSortByValues.set(checkboxValue, true);
                hideSortList();
            }

            // transform active sortby into a string
            let sortbyString = Object.entries(activeSortByValues)
                .filter(([key, value]) => value && key !== 'set')
                .map(([key]) => (key = key.replace(/^type/, '')));

            document.getElementById('sortbyParentLabel').innerHTML = sortbyString[0];

            // search for articles again
            document.getElementsByClassName(`spinner`)[0].style.opacity = '0.5';
            await doFetch(() => {
                document.getElementById('searchResultsCount').style.display = 'none';
            }, true);
            document.getElementsByClassName(`spinner`)[0].style.opacity = '0';
        });
    }
}
