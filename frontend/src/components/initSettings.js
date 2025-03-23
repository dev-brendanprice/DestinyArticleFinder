import { activeFilterValues, activeSortByValues } from './config/variables.js';

// set all DOM elements to saved content in localStorage
export default function initSettings() {

    // set default filter/sort-by values
    const storedFilters = window.localStorage.getItem('activeFilterValues');
    const storedSortBys = window.localStorage.getItem('activeSortByValues');

    if (!storedFilters) {
        window.localStorage.setItem('activeFilterValues', JSON.stringify(activeFilterValues));
    };
    if (!storedSortBys) {
        window.localStorage.setItem('activeSortByValues', JSON.stringify(activeSortByValues));
    };


    const filterValues = JSON.parse(window.localStorage.getItem('activeFilterValues'));
    const sortbyValues = JSON.parse(window.localStorage.getItem('activeSortByValues'));
    const parent = document.getElementById('searchFiltersContainer');

    // set variables.js objects (again)
    for (let type of Object.entries(filterValues)) {
        activeFilterValues.set(...type);
    };
    for (let type of Object.entries(sortbyValues)) {
        activeSortByValues.set(...type);
    };

    // filter DOM
    parent.querySelectorAll('[value=typeNews]')[0].checked = filterValues.typeNews;
    parent.querySelectorAll('[value=typeUpdate]')[0].checked = filterValues.typeUpdate;
    parent.querySelectorAll('[value=typeHotfix]')[0].checked = filterValues.typeHotfix;
    parent.querySelectorAll('[value=typeAll]')[0].checked = filterValues.typeAll;

    // sort-by DOM
    parent.querySelectorAll('[value=typeDateASC]')[0].checked = sortbyValues.typeDateASC;
    parent.querySelectorAll('[value=typeDateDES]')[0].checked = sortbyValues.typeDateDES;
    parent.querySelectorAll('[value=typeABC]')[0].checked = sortbyValues.typeABC;
};