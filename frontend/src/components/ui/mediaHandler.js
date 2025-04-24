// rewrite (force) URL protocol to match origin
export function rewriteProto(URL) {
    const newURL = `//${URL.split('://')[1]}`;
    return newURL;
};

// wait for media from specified query to load
export function waitForQueriesToLoad(query) {
    return new Promise((resolve, reject) => {

        // store to-be-loaded domQueries
        const articleContainer = document.getElementById('articleContainer');
        const domQueries = articleContainer.querySelectorAll(query);
        const elements = Array.from(domQueries);
        let domQueriesHandled = 0;

        // if passed query doesn't exist -> return function
        if (elements.length === 0) {
            resolve();
            return;
        }

        // wait for each element to be loaded
        for (let el of elements) {
            el.onload = () => {

                // if img element is article image, remove background placeholder
                if (el.nodeName === 'IMG' && el.id === 'articleImage') {
                    el.style.background = 'unset';
                }

                if (domQueriesHandled === elements.length) {
                    resolve();
                }
            };

            el.onerror = () => {
                reject({
                    error: new Error('An element failed to load. Object was removed from DOM.'),
                    onElement: el
                });
            };

            domQueriesHandled++;
        };
    });
}