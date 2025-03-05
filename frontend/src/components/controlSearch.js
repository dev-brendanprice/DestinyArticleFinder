// Remove wrapping span elements that have the highlight class
export function cleanseHighlightedSpans(el) {

    // Remove all span.highlight elements -> replace with their textContent
    let highlightedSpans = el.querySelectorAll('span.highlight');
    for (let span of highlightedSpans) {

        let textNode = document.createTextNode(span.textContent);
        let parentTextNode = span.parentNode;
        span.parentNode.replaceChild(textNode, span);
        parentTextNode.normalize();
    };

    // Remove all span.activeHighlight elements -> replace with their textContent
    let activeHighlightedSpans = el.querySelectorAll('span.activeHighlight');
    for (let span of activeHighlightedSpans) {

        let textNode = document.createTextNode(span.textContent);
        let parentTextNode = span.parentNode;
        span.parentNode.replaceChild(textNode, span);
        parentTextNode.normalize();
    };
};

// Highlight substrings where matching, store topOffsetY for window scroll event
export let positions = [];
export async function whatDoWeCallThisFunction(el, query) {

    positions = []; // reset matching substrings
    cleanseHighlightedSpans(el);

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let nodes = [];

    // Store [..] all nodes
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    };

    // Loop over nodes
    for (let node of nodes) {

        let text = node.textContent;
        let regex = new RegExp(`(${query})`, 'gi');
        let split = text.split(regex);

        // if array is longer than 1 item -> it contains the query
        if (split.length > 1) {

            // loop over fragments in split array -> reconstruct text node
            let parent = node.parentNode;
            for (let fragment of split) {
                
                if (regex.test(fragment)) {

                    // wrap matching text in highlight span
                    const span = document.createElement('span');
                    span.className = 'highlight';
                    span.textContent = fragment;
                    parent.insertBefore(span, node);

                    let anbar = {
                        el: span,
                        x: 0,
                        y: span.offsetTop - 200 // offset
                    };
    
                    positions.push(anbar);
                }
                else {

                    // create text node for non-matching text
                    const textNode = document.createTextNode(fragment);
                    parent.insertBefore(textNode, node);
                };
            };
            parent.removeChild(node); // remove (old) child node
        };
    };

    if (positions[0]) {
        window.scroll(0, positions[0].y);
        positions[0].el.className = 'activeHighlight'; // change first matching textNode
    };
};