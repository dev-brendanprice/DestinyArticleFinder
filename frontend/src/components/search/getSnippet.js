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
                console.log(match.toLowerCase().indexOf(query.toLowerCase()), query.toLowerCase());
                const idx = match.toLowerCase().indexOf(query.toLowerCase()) - 15 < 0 ? 0 : match.toLowerCase().indexOf(query.toLowerCase()) - 15;
                match = match.slice(idx, idx + 150).trim() + '..';
            }

            match = match.replace(/^[^A-Z0-9"]{0,3}\s*/, ''); // single leading chars

            console.log(match);
            return match.trim(); // return match
        }
    }

    return null;
};