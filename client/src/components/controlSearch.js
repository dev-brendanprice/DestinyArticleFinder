
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


// DEPRECATED --do not use
let substringPositions = [];
function getSubstringPositions(element, substring) {

    substringPositions = [];

    // Create a TreeWalker to traverse all text nodes within the element
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let textNode;
    while ((textNode = walker.nextNode())) {

        substring = substring.toLowerCase();
        let text = textNode.textContent.toLowerCase();
        let startIndex = 0;
        let index;
        
        // Find all occurrences of the substring in the current text node
        while ((index = text.indexOf(substring, startIndex)) > -1) {
            
            // Create a Range covering the substring
            const range = document.createRange();
            range.setStart(textNode, index);
            range.setEnd(textNode, index + substring.length);

            // Get the bounding client rects for the range
            const rects = range.getClientRects();

            // There may be multiple rects if the substring spans lines or is wrapped
            for (let rect of rects) {
                substringPositions.push({
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY,
                    width: rect.width,
                    height: rect.height
                });
            };

            // Move the start index forward
            startIndex = index + substring.length;
        };
    };
};


// DEPRECATED --do not use
function highlightMatches(element, substring) {

    removeHighlights(element);

    if (substring === "") return;
  
    // Create a TreeWalker to traverse all text nodes within the element
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
  
    const nodes = [];
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    };
  
    nodes.forEach(node => {

        const text = node.textContent;
        const regex = new RegExp(`(${substring})`, 'gi');

        // Split the text based on the regex
        const fragments = text.split(regex);

        if (fragments.length > 1) {

            const parent = node.parentNode;
            fragments.forEach((fragment, i) => {

                if (regex.test(fragment)) {
                    // Create a span for the highlighted part
                    const span = document.createElement('span');
                    span.className = 'highlight';
                    span.textContent = fragment;
                    parent.insertBefore(span, node);
                }
                else {
                    // Create a text node for the non-highlighted part
                    const textNode = document.createTextNode(fragment);
                    parent.insertBefore(textNode, node);
                };
            });
            parent.removeChild(node);
        };
    });
};