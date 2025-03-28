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
import './assets/close.svg';
import './assets/copy.svg';
import './assets/download.svg';
import './assets/fold.svg';
import './assets/link.svg';
import './assets/magnify.svg';
import './assets/match_arrow.svg';
import './assets/more.svg';
import './assets/open.svg';
import './assets/settings.svg';

import { handleRoutes } from './components/handleRoutes.js';
import intializeEvents from './components/initEvents.js';
import intializeSettings from './components/initSettings.js';

intializeEvents(); // config UI/UX events
intializeSettings(); // load user settings/defaults
handleRoutes(); // handle url routes
console.log('Welcome to Destiny Article Finder!');
