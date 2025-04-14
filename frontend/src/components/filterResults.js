export let activeFilterValues = {
    typeTwab: false,
    typeNews: false,
    typeUpdate: false,
    typeHotfix: false,
    typeAll: true, // default

    // change target to boolean in localStorage
    set(target, boolean) {
        this[target] = boolean;
        const { ...values } = this;
        window.localStorage.setItem('activeFilterValues', JSON.stringify(values));
    }
};