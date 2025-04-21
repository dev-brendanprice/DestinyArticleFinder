 
// ensure that reader controls are always shown on mobile - TO:DO REFACTOR THIS
export function initializeMobileReaderControls() {
    let controlsPosition = 0;
    let wrapper = document.getElementById('tabGroupsAndControlsWrapper');
    let controls = document.getElementById('tabGroupsAndControls');
    let input = document.getElementById('controlSearchBar');

    // set top margin to ensure controls always appear at top of screen
    function setTopMargin() {
        const distanceFromTopOfViewport = wrapper.getBoundingClientRect().top;
        if (distanceFromTopOfViewport < 0) {
            controls.classList.add('down'); // add animation class
            controlsPosition = Math.abs(distanceFromTopOfViewport);

            // offset by 2 if at bottom of page to avoid margin gap
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                controlsPosition -= 2;
            }
    
            // dont reposition if at top of page
            if (window.scrollY < 110) {
                return;
            }

            controls.style.marginTop = `${controlsPosition + 1}px`;
        }
    }

    const debounceMargin = () => setTimeout(setTopMargin, 100); // call on a 100ms debounce to avoid the wrapper flickering

    // reset controls position if they have been pushed up from "soft" keyboard/other things
    function showControls() {
        if (controlsPosition > 0) {
            controls.classList.remove('down');
            controlsPosition = 0;
            controls.style.marginTop = '0px';
        }
        debounceMargin();
    }

    window.addEventListener('scroll', showControls); // debounce on scroll
    input.addEventListener('blur', showControls); // debounce on "soft" (virtual) keyboard is closed
};