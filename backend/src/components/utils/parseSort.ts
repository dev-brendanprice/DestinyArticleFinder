export default function parseSort(sort: String): String {

    let sortFromQuery: Array<string> = (<string>sort)?.split(',');

    // if no sort param is present, sort date in descending order
    if (!sortFromQuery) return 'date DESC';
    
    // only accept (one) the first item in comma list
    if (sortFromQuery.length > 1) {
        sortFromQuery = [sortFromQuery[0].toLowerCase()];
    }

    const sortValue: String = sortFromQuery[0];
    const sorts = {
        'datedes': 'date DESC',
        'dateasc': 'date ASC',
        'abc': 'title ASC'
    };

    return sorts[<string>sortValue]; // returns SQL-equivalent sort by
};
