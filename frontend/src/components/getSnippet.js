// return snippet of htmlContent that contains searchTerm
export function getSnippet(article, searchTerm) {

    const doc = new DOMParser().parseFromString(article.htmlContent, 'text/html');
    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
    let nodes = [];
    let snippet = '';

    // store all dom nodes
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }

    for (let node of nodes) {
        let text = node.textContent;
        let regex = new RegExp(`(${searchTerm})`, 'gi'); // case-insensitive
        let split = text.split(regex); // split each node, with regex

        // array is longer than 1: it contains the substring
        if (split.length > 1) {
            let parent = node.parentNode;

            for (let fragment of split) {
                if (regex.test(fragment)) {

                    // wrap matching substrings in highlighted span
                    const span = document.createElement('span');
                    span.className = 'highlight-lighter';
                    span.textContent = fragment;
                    parent.insertBefore(span, node);

                    const strToLowercase = parent.textContent.toString().toLowerCase();
                    const parentLength = strToLowercase.length;
                    snippet = parent;

                    // +10 chars extra space for any nbsp, etc.
                    if (parentLength < searchTerm.length + 10) {

                        // if parent is a list
                        const parentOfParent = parent.parentNode;
                        if (parent.nodeName === 'LI') {

                            // look for context to show before and after (parent and child), show one or the other, not both
                            const childListElement = parentOfParent.querySelector('ul');
                            if (childListElement) { // show child context
                                parent.appendChild(childListElement);
                                snippet = parent;
                            } else { // show parent context

                                const previousSibling = parent.parentNode.parentNode.previousSibling;
                                if (previousSibling) {
                                    const container = document.createElement('div');
                                    previousSibling.append(parent.parentNode);
                                    container.append(previousSibling);
                                    snippet = container;
                                } else {
                                    snippet = parent.parentNode.parentNode;
                                };

                                // return string if length of parent list is over 15 with no context
                                if (parentOfParent.querySelectorAll('li').length > 15) {
                                    snippet = 'Could not find any context.';
                                }
                            };
                            
                        };

                    } else if (parentLength > 200) {
                        const startIdx = strToLowercase.indexOf(searchTerm);
                        const trimmedTextContent = parent.textContent.substring(startIdx - 125, startIdx + 125);
                        snippet = `..${trimmedTextContent}`;
                    }
                } else {
                    // create text node for non-matching text
                    const textNode = document.createTextNode(fragment);
                    parent.insertBefore(textNode, node);
                }
            }
            parent.removeChild(node); // remove (old) child node
        }
    }

    return snippet;
}
