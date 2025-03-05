import { renderArticle } from './renderArticle.js';

// tabGroup object with getter/setter functions
const tabGroup = {

    tabArticles: [],
    currentTabIndex: 0, // used to distinguish tabs

    addTab(article, searchTerm) {
        this.tabArticles.push({article: article, search: searchTerm});
    },
    removeTab(index) {
        this.tabArticles.splice(index, 1);
    }
};

export function addTabToGroup(article, searchTerm) {

    tabGroup.addTab(article, searchTerm); // Add tab to array
    const tabObjLength = Object.keys(tabGroup.tabArticles).length;
    const newTab = document.createElement('div');
    const tabTitle = document.createElement('div');
    const tabCloseButton = document.createElement('img');

    newTab.classList.add('activeTab');
    newTab.id = 'tabItem';
    tabTitle.id = 'tabTitle';
    tabCloseButton.id = 'btnCloseTab';

    tabTitle.innerHTML = `${article.type.toUpperCase()}, "${searchTerm}"`;
    tabCloseButton.src = './assets/button_close.svg';

    newTab.append(tabCloseButton, tabTitle);
    newTab.setAttribute('data-tabIndex', tabObjLength);
    tabGroup.currentTabIndex = tabGroup.currentTabIndex+1;

    // remove activeTab class from all tabs
    const tabGroupContainer = document.getElementById('tabGroupContainer');
    for (let child of tabGroupContainer.children) {
        child.removeAttribute('class');
    };
    
    tabGroupContainer.appendChild(newTab);

    // listen for tab close and tab click events
    tabCloseButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTabFromGroup(e)
    });
    newTab.addEventListener('click', (e) => {

        const tabContainer = e.target;
        const tabGroupContainer = tabContainer.parentElement;

        for (let child of tabGroupContainer.children) {
            child.removeAttribute('class'); // remove activeTab class from all tabs
        };
        tabContainer.classList.add('activeTab');

        const selectedTabIndex = parseInt(newTab.getAttribute('data-tabIndex'));
        if (selectedTabIndex !== tabGroup.currentTabIndex) {
            tabGroup.currentTabIndex = selectedTabIndex;
            renderArticle(article, searchTerm);
        };
    });
};

function removeTabFromGroup(e) {

    const tabContainer = e.target.parentElement;
    const tabGroupContainer = tabContainer.parentElement;
    const tabIndex = parseInt(tabContainer.getAttribute('data-tabIndex'))-1;

    tabGroup.currentTabIndex = tabIndex;
    tabGroup.removeTab(tabIndex); // remove tab from array
    tabContainer.remove(); // remove tab from DOM
    if (tabGroup.tabArticles.length === 0) location.reload(); // if no tabs left

    // assign activeTab class to now-open tab
    for (let child of tabGroupContainer.children) {
        child.removeAttribute('class');
    };
    tabGroupContainer.children[0].className = 'activeTab';
    
    // reassign data-tabIndex indexes
    for (let i=0; i<tabGroupContainer.children.length; i++) {
        const child = tabGroupContainer.children[i];
        child.setAttribute('data-tabIndex', i+1);
    };

    renderArticle(tabGroup.tabArticles[0].article);
};