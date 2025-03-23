/* eslint-disable no-unused-vars */

// this obj is unique for development and production environments
export const variables = {
};

export let activeFilterValues = {
    "typeNews": false,
    "typeUpdate": false,
    "typeHotfix": false,
    "typeAll": true, // default

    set(target, boolean) { // changes the "target" to "boolean" in localStorage
        this[target] = boolean;
        const { set, ...values } = this;
        window.localStorage.setItem('activeFilterValues', JSON.stringify(values));
    }
};

export let activeSortByValues = {
    "typeDateASC": true, // default
    "typeDateDES": false,
    "typeABC": false,

    set(target, boolean) {
        this[target] = boolean;
        const { set, ...values } = this;
        window.localStorage.setItem('activeSortByValues', JSON.stringify(values));
    }
};