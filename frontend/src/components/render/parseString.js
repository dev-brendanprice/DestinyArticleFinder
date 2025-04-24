const replacements = [
    [/r/g, "w"],
    [/R/g, "W"],
    [/l/g, "w"],
    [/L/g, "W"],
    [/\bhas\b/g, "haz"],
    [/\bHas\b/g, "haz"],
    [/\bhave\b/g, "haz"],
    [/\bHave\b/g, "Haz"],
    [/\byou\b/g, "uu"],
    [/\bYou\b/g, "Uu"],
    [/\bthis\b/g, "dis"],
    [/\bThis\b/g, "Dis"],
    [/the /g, "da "],
    [/The /g, "Da "],
    [/!/g, "! OwO"],
    [/\?/g, "? UwU"],
];

// uwu-ify a specified html object
export function uwufyHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    function traverseAndUwuify(node) {

        // only parse if node is text, else traverse children nodes if any
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            for (const [pattern, replacement] of replacements) {
                text = text.replace(pattern, replacement);
            }
            node.nodeValue = text;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                traverseAndUwuify(child);
            }
        }
    };

    traverseAndUwuify(doc.body);
    return doc.body.innerHTML;
}

// uwu-ify a given string
export function uwufyString(string) {
    for (const [pattern, replacement] of replacements) {
        string = string.replace(pattern, replacement);
    };

    return string;
}