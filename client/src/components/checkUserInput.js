
// Check if given user input has been changed and is not null
let globalSearchTerm = '';
export function isEntryValid(searchBar) {

    const searchTerm = `${searchBar.value}`; // type-cast string
    const isValid = searchTerm.length !== 0 && globalSearchTerm !== searchTerm; // value is not empty and has changed (??)
    
    globalSearchTerm = searchTerm; // store search term for next check
    return isValid;
};

// Check if event.code is the Escape key; close window/stop process
export function isEscCommand(event) {
    const keyCode = event.code;
    const isExitCommand = keyCode === 'Escape';
    return isExitCommand;
};