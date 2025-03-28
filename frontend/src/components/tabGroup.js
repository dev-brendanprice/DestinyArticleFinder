import { removeArticleFromRoute } from './handleRoutes.js';
import { resetPositionIndex } from './initEvents.js';
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

    newTabTitle.innerHTML = `${article.type}, "${searchTerm}"`;
    newTabCloseButton.src = './assets/close.svg';

    newTabElement.append(newTabCloseButton, newTabTitle);
    newTabElement.setAttribute('data-tabIndex', tabCount);

    // remove activeTab class from all tabs
    for (let child of tabGroupContainer.children) {
        child.removeAttribute('class');
    }

    tabGroup.currentTabIndex = tabCount - 1; // set to new tab's index
    console.log(tabGroup.tabArticles.length);
    // tab click
    newTabElement.addEventListener('click', e => {
        // idk how but this stops the active being rendered again
        console.log(tabGroup.tabArticles.length);
        if (tabGroup.tabArticles.length === 1) {
            return;
        }

        const tabContainer = e.target;
        const tabGroupContainer = tabContainer.parentElement;
        const selectedTabIndex = parseInt(tabContainer.getAttribute('data-tabIndex')) - 1;
        resetPositionIndex(); // reset the positionIndex for reader controls' string matching

        // remove activeTab class from all tabs
        for (let child of tabGroupContainer.children) {
            child.removeAttribute('class');
        }
        tabContainer.classList.add('activeTab'); // assign activeTab class to clicked tab

        // set searchTerm tabGroup.[article].search
        searchTerm = tabGroup.tabArticles[selectedTabIndex].search;

        // when different tab is clicked
        if (selectedTabIndex !== tabGroup.currentTabIndex) {
            console.log(tabGroup);
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

    const tabThatsBeingRemoved = tabGroup.tabArticles[tabIndex];
    removeArticleFromRoute(tabThatsBeingRemoved.article.hostedUrl, tabThatsBeingRemoved.search);

    tabGroup.currentTabIndex = tabIndex;
    tabGroup.removeTab(tabIndex); // remove tab from array
    tabContainer.remove(); // remove tab from DOM

    // if closed tab was the last tab
    if (tabGroup.tabArticles.length === 0) {
        window.location.href = window.location.origin;
    }

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

    const nowActiveTab = tabGroup.tabArticles[0];
    renderArticle(nowActiveTab.article, nowActiveTab.search);
}
