import { removeArticleFromRoute } from './handleRoutes.js';
import { resetPositionIndex } from './initEvents.js';
import { renderArticle } from './renderArticle.js';

// 'searchTerm' in addTab() is so reader controls retains its search term between tab loads/removal
export const TabGroup = {
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
    TabGroup.addTab(article, searchTerm); // Add tab to group
    const amountOfTabs = Object.keys(TabGroup.tabArticles).length;
    const tabElement = document.createElement('div');
    const tabTitle = document.createElement('div');
    const tabClose = document.createElement('img');
    const tabGroupContainer = document.getElementById('tabGroupContainer');

    tabElement.classList.add('activeTab');
    tabElement.id = 'tabItem';
    tabTitle.id = 'tabTitle';
    tabClose.id = 'btnCloseTab';

    tabTitle.innerHTML = `${article.type}, "${searchTerm}"`;
    tabClose.src = './assets/close.svg';

    tabElement.append(tabClose, tabTitle);
    tabElement.setAttribute('data-tabIndex', amountOfTabs);

    // remove active style class from all tabs, add it to new tab
    for (let child of tabGroupContainer.children) {
        child.removeAttribute('class');
    }

    TabGroup.currentTabIndex = amountOfTabs - 1; // set current index to new tab (array.length - 1; the article is appended to the right)

    // tab click
    tabElement.addEventListener('click', e => {
        // if there is only tab in the tab group, ignore the click event (don't load the contents of the tab)
        if (TabGroup.tabArticles.length === 1) {
            return;
        }

        console.log(e.target);

        const targetTab = e.target;
        const targetTabParent = targetTab.parentElement;
        const targetTabIndex = parseInt(targetTab.getAttribute('data-tabIndex')) - 1;
        resetPositionIndex(); // reset the positionIndex for reader controls' string-matching

        // remove active style class from all tabs, add it to target tab
        for (let child of targetTabParent.children) {
            child.removeAttribute('class');
        }
        targetTab.classList.add('activeTab');

        // set searchTerm to TabGroup.[article].search
        searchTerm = TabGroup.tabArticles[targetTabIndex].search;

        // when different tab is clicked, render target tab
        if (targetTabIndex !== TabGroup.currentTabIndex) {
            TabGroup.currentTabIndex = targetTabIndex;
            renderArticle(article, searchTerm);
        }
    });

    // tab close
    tabClose.addEventListener('click', e => {
        e.stopPropagation();
        removeTabFromGroup(e);
    });

    tabGroupContainer.appendChild(tabElement);
}

function removeTabFromGroup(e) {
    const tabContainer = e.target.parentElement;
    const tabGroupContainer = tabContainer.parentElement;
    const tabIndex = parseInt(tabContainer.getAttribute('data-tabIndex')) - 1;

    const tabThatsBeingRemoved = TabGroup.tabArticles[tabIndex];
    removeArticleFromRoute(tabThatsBeingRemoved.article.hostedUrl, tabThatsBeingRemoved.search);

    TabGroup.currentTabIndex = tabIndex;
    TabGroup.removeTab(tabIndex); // remove tab from array
    tabContainer.remove(); // remove tab from DOM

    // if closed tab was the last tab
    if (TabGroup.tabArticles.length === 0) {
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

    const nowActiveTab = TabGroup.tabArticles[0];
    renderArticle(nowActiveTab.article, nowActiveTab.search);
}
