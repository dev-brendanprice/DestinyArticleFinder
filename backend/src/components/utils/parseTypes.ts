export default function parseTypes(types: String): Array<string> {
    if (!types) return ['all']; // return all if none specified

    let returnVal: Array<string> = (<string>types)?.split(',');

    // change all items to lowercase
    returnVal = returnVal.map(item => {
        return item.toLowerCase();
    });

    // remove array duplicates
    returnVal = returnVal.filter((item, index) => {
        return returnVal.indexOf(item) === index;
    });

    return returnVal;
}
