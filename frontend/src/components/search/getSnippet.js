import { load } from 'cheerio';

// get sentence with matching substring (assume all regex stuff is vibe-coded)
export function getSnippet(html, query) {

    const $ = load(html);
    const text = $('body').text();
    const sentences = text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]/g); // sentence splitting (this regex is vibe-coded)

    if (!sentences) {return null;}
    const lowerQuery = query.toLowerCase();

    for (const sentence of sentences) {
        if (sentence.toLowerCase().includes(lowerQuery)) {

            let match = sentence;
            match = match.replace(/([a-z])([A-Z])/g, '$1 $2'); // "AceOfSpades" -> "Ace Of Spades"
            match = match.trim();

            // if string over 150 chars
            if (match.length > 150) {
                const idx = match.toLowerCase().indexOf(query.toLowerCase()) - 15 < 0 ? 0 : match.toLowerCase().indexOf(query.toLowerCase()) - 15;
                match = match.slice(idx, idx + 150).trim() + '..';
            }

            match = match.replace(/^[^A-Z0-9"]{0,3}\s*/, ''); // single leading chars
            return match.trim(); // return match
        }
    }

    return null;
};

// encase substring with <b>
export function highlightSubstring(string, substring) {
    if (!substring) {return string;}
    const escapedSubstring = substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
    const regex = new RegExp(escapedSubstring, 'gi'); // Case-insensitive match
    return string.replace(regex, match => `<b id="highlightedSnippetText">${match}</b>`);
};