import './css/article.css';
import './css/header.css';
import './css/index.css';
import './css/scroll.css';
import './css/tabGroup.css';
import './css/spinner.css';
import './css/viewports.css';
import './css/imageControls.css';

import './assets/match_arrow.svg';
import './assets/close.svg';
import './assets/bungie_shield.svg';
import './assets/settings.svg';
import './assets/Aa.svg';
import './assets/download.svg';
import './assets/magnify.svg';
import './assets/more.svg';
import './assets/open.svg';
import './assets/more.svg';
import './assets/copy.svg';
import './assets/link.svg';
import './assets/fold.svg';
import './assets/bg.png';

import intializeEvents from './components/initEvents.js';
import intializeSettings from './components/initSettings.js';

intializeEvents(); // config UI/UX events
intializeSettings(); // load user settings/defaults
console.log('Welcome to Destiny Article Finder!');