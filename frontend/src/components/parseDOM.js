// parse a HTML document that is in the format of a string
export function parseDOM(htmlContent) {
    htmlContent = new DOMParser().parseFromString(htmlContent, 'text/html'); // parse string to HTML
    const allQueries = htmlContent.querySelectorAll('*'); // [...NodeList]
    const ignoredTags = ['BR'];

    for (let item of allQueries) {
        if (ignoredTags.includes(item.tagName)) {
            continue; // ignore specific tags
        }

        if (item.tagName === 'DIV') {

            // remove (potentially) conflicting classes

            item.classList.remove('content');
            item.classList.remove('text-content');
            if (item.classList.length === 0) {
                item.removeAttribute('class');
            }
        }

        if (item.tagName === 'IMG') {
            item.id = 'articleImage';
            item.removeAttribute('style');

            // item.removeAttribute('loading'); // (toggleable lazy-loading!)

            // wrap image in a container
            const container = document.createElement('div');
            container.classList.add('articleImageContainer');
            item.parentNode.insertBefore(container, item);
            container.appendChild(item);
        }

        if (item.tagName === 'IFRAME') {
            item.id = 'articleIframe';
        }
    }

    return `${htmlContent.documentElement.innerHTML}`;
}
