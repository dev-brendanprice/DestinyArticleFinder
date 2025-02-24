// Create variations from string (e.g. "sunshot", "Sunshot", "SUNSHOT")
export function createStringVariation(substring) {
    return [
        substring.toLowerCase(), // lowercase
        substring.toUpperCase(), // uppercase
        substring.charAt(0).toUpperCase() + substring.slice(1).toLowerCase() // capitalised
    ];
};
