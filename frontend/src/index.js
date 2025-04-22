import './css/article.css';
import './css/header.css';
import './css/imageControls.css';
import './css/index.css';
import './css/scroll.css';
import './css/spinner.css';
import './css/tabGroup.css';
import './css/viewports.css';

import './assets/Aa.svg';
import './assets/bg.png';
import './assets/bungie_shield.svg';
import './assets/burger_menu.svg';
import './assets/close.svg';
import './assets/copy.svg';
import './assets/download.svg';
import './assets/fold.svg';
import './assets/fwd_blue.svg';
import './assets/link.svg';
import './assets/link_blue.svg';
import './assets/magnify.svg';
import './assets/match_arrow.svg';
import './assets/more.svg';
import './assets/open.svg';
import './assets/settings.svg';

import { initializeVariables } from './components/config/variables.js';
import { getLatestRelease } from './components/config/version.js';
import { handleRoutes } from './components/handleRoutes.js';
import intializeEvents from './components/initEvents.js';
import intializeSettings from './components/initSettings.js';
import { initializeMobileReaderControls } from './components/mobileViews.js';

initializeVariables(); // ..
intializeEvents(); // config UI/UX events
intializeSettings(); // load user settings/defaults
initializeMobileReaderControls(); // change DOM layout if mobile is being used
handleRoutes(); // handle url routes

export const version = await getLatestRelease(); // get and save latest version from release tag
console.log(`%cDestiny Article Finder ${version}`, 'font-weight: bold;font-size: 1.75em;');
