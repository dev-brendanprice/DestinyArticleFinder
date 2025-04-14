export let activeSortByValues = {
    typeDateASC: true, // default
    typeDateDES: false,
    typeABC: false,

    // change target to boolean in localStorage
    set(target, boolean) {
        this[target] = boolean;
        const { ...values } = this;
        window.localStorage.setItem('activeSortByValues', JSON.stringify(values));
    }
};