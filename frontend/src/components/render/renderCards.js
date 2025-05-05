 
 
import { API_HOST } from "../../index.js";
import { itemSubTypeStrings, returnDefinition } from "../core/manifest.js";

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


// get 12 random items from GIVEN definitions object
async function getRandomItemsFromManifest(definitionsObject) {

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        };
        return array;
    };

    const shuffledArray = shuffleArray(Object.values(definitionsObject));
    return shuffledArray.slice(0, 12); // return first 12 values
};


// long-winded process to get statistic graphs for a randomised selection of DestinyInventoryItems
async function getGraphs() {

    // get inventoryItemDefinitions and keep the required itemSubTypes (e.g. only keep "Weapon")
    let inventoryItemDefinitions = await returnDefinition('DestinyInventoryItemDefinition');
    
    const allowedItemTypes = [3];
    const definitionValues = Object.values(inventoryItemDefinitions);
    inventoryItemDefinitions = {};

    for (let inventoryItem of definitionValues) {
        if (allowedItemTypes.includes(inventoryItem.itemType)) {

            const itemName = inventoryItem.displayProperties.name.replace('/', '').replace(',', ''); // sanitise names
            inventoryItemDefinitions[inventoryItem.hash] = {
                itemName: itemName,
                itemSubType: itemSubTypeStrings[inventoryItem.itemSubType],
                itemHash: inventoryItem.hash,
                itemRarity: inventoryItem.inventory.tierTypeName,
                iconURL: `https://www.bungie.net${inventoryItem.displayProperties.icon}`,
            };
        };
    };

    const randomItemsArray = await getRandomItemsFromManifest(inventoryItemDefinitions); // get first 12 unique randomised items
    const itemGraphs = await getItemSVGData(randomItemsArray); // get graphs for each item
    
    return itemGraphs.data[0];
};


// render the sliding cards
export async function renderCards() {

    const itemGraphs = await getGraphs();


    // build slider cards --nuke this shit 
    const topSetFirst = document.getElementById('topSetFirst');
    const topSetLast = document.getElementById('topSetLast');
    const bottomSetFirst = document.getElementById('bottomSetFirst');
    const bottomSetLast = document.getElementById('bottomSetLast');
    let count = 0;

    // build each card
    for (let [key, value] of Object.entries(itemGraphs)) {
        
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
    
    // only swap container display if it's NOT "none"
    const sliderContainer = document.getElementById('sliderConOuter');
    if (sliderContainer.style.display !== 'none') {
        sliderContainer.style.display = 'flex';
    };
};