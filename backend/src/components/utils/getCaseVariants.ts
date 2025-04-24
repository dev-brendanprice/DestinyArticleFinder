export default function getCaseVariants(substring: String): Array<string> {
    return [
        substring.toLowerCase(),
        substring.toUpperCase(),
        substring.charAt(0).toUpperCase() + substring.slice(1).toLowerCase() // first letter
    ];
}
