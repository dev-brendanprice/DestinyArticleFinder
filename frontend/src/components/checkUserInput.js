// Check if given user input has been changed and is not null
let globalSearchTerm = '';
export function isEntryValid(searchBar, isResend) {
    const searchTerm = `${searchBar.value}`; // type-cast string
    let isValid = searchTerm.length !== 0 && globalSearchTerm !== searchTerm; // value is not empty and has changed

    if (isResend) {
        if (searchTerm.length !== 0) {isValid = true;}
    }

    globalSearchTerm = searchTerm; // store search term for next check
    return isValid;
}

// Check if event.code is the Escape key; close window/stop process
export function isEscCommand(event) {
    const keyCode = event.code;
    const isExitCommand = keyCode === 'Escape';
    return isExitCommand;
}
