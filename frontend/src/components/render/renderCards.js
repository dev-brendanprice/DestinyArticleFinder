 
 
import { API_HOST } from "../../index.js";
import fetchGearFromManifest from "../core/manifest.js";

// get manifest 
const manifest = await fetchGearFromManifest();

// get 12 random items from the manifest
async function getRandomItemsFromManifest() {

    // generate 12 random numbers to use as indexes
    let randomIndexes = new Set();
    for (let i = 0; i < 12; i++) {

        // prevent duplicate indexes
        let index = Math.floor(Math.random() * manifest.size);
        while (randomIndexes.has(index)) {
            index = Math.floor(Math.random() * manifest.size);
        };
        randomIndexes.add(index);
    };

    // get manifest items from random indexes
    const items = Array.from(randomIndexes).map(v => Array.from(manifest)[v]);
    return items;
};

// get the SVG data for each item in array of items
async function getItemSVGData(randomItemsArray) {

    const url = `${API_HOST}/api/v1/graphs`;
    const svgData = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(randomItemsArray)
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);
            return [];
        });
    
    return svgData;
};


// render the sliding cards
export async function renderCards() {

    // get random inventoryItem & SVG graph data 
    const randomItemsArray = await getRandomItemsFromManifest();
    let itemsArray = await getItemSVGData(randomItemsArray);
    itemsArray = itemsArray.data[0];


    // build slider cards --nuke this shit 
    const topSetFirst = document.getElementById('topSetFirst');
    const topSetLast = document.getElementById('topSetLast');
    const bottomSetFirst = document.getElementById('bottomSetFirst');
    const bottomSetLast = document.getElementById('bottomSetLast');
    let count = 0;

    // build each card
    for (let [key, value] of Object.entries(itemsArray)) {
        
        const sliderCard = document.createElement('div'); // the card itself
        const sliderAttrs = document.createElement('div'); // title, subtitle
        const sliderContent = document.createElement('div'); // item png, graph

        const title = document.createElement('div');
        const subtitle = document.createElement('div');
        const itemImg = document.createElement('img');
        const itemGraph = document.createElement('img');

        // css classes,ids
        sliderCard.className = 'sliderCard';
        sliderContent.classname = 'sliderContent';
        title.className = 'sliderTitle';
        subtitle.className = 'sliderSubtitle';
        itemGraph.className = 'sliderGraph';

        // element attrs
        title.innerHTML = `${key}`;
        subtitle.innerHTML = `// ${value.inventoryItem.itemRarity} // ${value.inventoryItem.itemSubType}`;
        itemImg.style.display = 'none'; // temporary
        
        // create svg graph from string, assign to img element
        const blob = new Blob([value.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        itemGraph.src = url; // render de imageee
        itemGraph.addEventListener('load', () => URL.revokeObjectURL(url), { once: true }); // revoke url after load (cleanup)

        // append to elements to DOM
        sliderAttrs.append(title, subtitle);
        sliderContent.append(itemImg, itemGraph);
        sliderCard.append(sliderAttrs, sliderContent);
        
        // we have to clone, else the latter .append will take precedence and the former wont run
        const duplicateSliderCard = sliderCard.cloneNode(true);

        // if >= 6, append to bottom slider container
        if (count < 6) {
            topSetFirst.append(sliderCard);
            topSetLast.append(duplicateSliderCard);
        } else if (count >= 6) {
            bottomSetFirst.append(sliderCard);
            bottomSetLast.append(duplicateSliderCard);
        };

        count++;
    };

    // hide skeleton-load and show rendered sliders
    document.getElementById('slidersLoadingContainer').style.display = 'none';
    document.getElementById('sliderConOuter').style.display = 'flex';
};