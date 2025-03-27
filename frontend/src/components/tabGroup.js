import { renderArticle } from './renderArticle.js';

// tabGroup object with getter/setter functions
const tabGroup = {
    tabArticles: [],
    currentTabIndex: 0, // used to distinguish tabs

    addTab(article, searchTerm) {
        this.tabArticles.push({ article: article, search: searchTerm });
    },
    removeTab(index) {
        this.tabArticles.splice(index, 1);
    }
};

export function addTabToGroup(article, searchTerm) {
    tabGroup.addTab(article, searchTerm); // Add tab to array
    const tabCount = Object.keys(tabGroup.tabArticles).length;
    const newTabElement = document.createElement('div');
    const newTabTitle = document.createElement('div');
    const newTabCloseButton = document.createElement('img');
    const tabGroupContainer = document.getElementById('tabGroupContainer');

    newTabElement.classList.add('activeTab');
    newTabElement.id = 'tabItem';
    newTabTitle.id = 'tabTitle';
    newTabCloseButton.id = 'btnCloseTab';

    newTabTitle.innerHTML = `${article.type.toUpperCase()}, "${searchTerm}"`;
    newTabCloseButton.src = './assets/close.svg';

    newTabElement.append(newTabCloseButton, newTabTitle);
    newTabElement.setAttribute('data-tabIndex', tabCount);

    // remove activeTab class from all tabs
    for (let child of tabGroupContainer.children) {
        child.removeAttribute('class');
    }

    tabGroup.currentTabIndex = tabCount - 1; // set to new tab's index
    console.log(tabGroup);

    // tab click
    newTabElement.addEventListener('click', e => {
        const tabContainer = e.target;
        const tabGroupContainer = tabContainer.parentElement;
        const selectedTabIndex = parseInt(tabContainer.getAttribute('data-tabIndex')) - 1;

        // remove activeTab class from all tabs
        for (let child of tabGroupContainer.children) {
            child.removeAttribute('class');
        }
        tabContainer.classList.add('activeTab'); // assign activeTab class to clicked tab

        // set searchTerm tabGroup.[article].search
        searchTerm = tabGroup.tabArticles[selectedTabIndex].search;

        // when different tab is clicked
        if (parseInt(selectedTabIndex) !== parseInt(tabGroup.currentTabIndex)) {
            const prevTabIndex = tabGroup.currentTabIndex; // store previous tab's index
            const prevTabString = document.getElementById('controlSearchBar').value; // store previous tab's search query
            tabGroup.tabArticles[prevTabIndex].search = prevTabString; // store previous tab's search query

            // render selected tab
            tabGroup.currentTabIndex = selectedTabIndex;
            renderArticle(article, searchTerm);
        }
    });

    // tab close
    newTabCloseButton.addEventListener('click', e => {
        e.stopPropagation();
        removeTabFromGroup(e);
    });

    tabGroupContainer.appendChild(newTabElement);
}

function removeTabFromGroup(e) {
    const tabContainer = e.target.parentElement;
    const tabGroupContainer = tabContainer.parentElement;
    const tabIndex = parseInt(tabContainer.getAttribute('data-tabIndex')) - 1;

    tabGroup.currentTabIndex = tabIndex;
    tabGroup.removeTab(tabIndex); // remove tab from array
    tabContainer.remove(); // remove tab from DOM
    if (tabGroup.tabArticles.length === 0) {
        location.reload();
    } // if no tabs left

    // assign activeTab class to now-open tab
    for (let child of tabGroupContainer.children) {
        child.removeAttribute('class');
    }
    tabGroupContainer.children[0].className = 'activeTab';

    // reassign data-tabIndex indexes
    for (let i = 0; i < tabGroupContainer.children.length; i++) {
        const child = tabGroupContainer.children[i];
        child.setAttribute('data-tabIndex', i + 1);
    }

    renderArticle(tabGroup.tabArticles[0].article);
}
