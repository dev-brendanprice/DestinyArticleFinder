const itemSubTypeStrings = {
    6: "Auto Rifle",
    7: "Shotgun",
    8: "Machine Gun",
    9: "Hand Cannon",
    10: "Rocket Launcher",
    11: "Fusion Rifle",
    12: "Sniper Rifle",
    13: "Pulse Rifle",
    14: "Scout Rifle",
    17: "Sidearm",
    18: "Sword",
    22: "Linear Fusion Rifle",
    23: "Grenade Launcher",
    24: "Submachine Gun",
    25: "Trace Rifle",
    26: "Helmet Armor",
    27: "Gauntlets Armor",
    28: "Chest Armor",
    29: "Leg Armor",
    30: "Class Armor",
    31: "Bow",
    33: "Glaive"
};

// Return manifest components
async function getManifestSuffixes() {

    try {
        const manifestURL = 'https://www.bungie.net/Platform/Destiny2/Manifest/';
        const manifest = await fetch(manifestURL, {
            headers: {
                'X-API-Key': '632a99eecbdc40149684e6fe2fd8b3f4'
            }
        })
            .then(res => res.json())
            .then(data => {
                return data;
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    
        const suffixes = manifest.Response.jsonWorldComponentContentPaths.en;
        return suffixes;

    } catch (err) {
        console.error(err);
    };
};

export default async function fetchGearFromManifest() {

    async function getManifest() {
        try {
            const suffixes = await getManifestSuffixes();
            const manifestURL = `https://www.bungie.net${suffixes['DestinyInventoryItemDefinition']}`;
            const definitions = await fetch(manifestURL)
                .then(res => res.json())
                .then(data => {
                    return data;
                })
                .catch(err => {
                    console.error(err);
                    return [];
                });
            
            return definitions;

        } catch (err) {
            console.error(err);
            return [];
        };
    };
    
    const definitions = await getManifest();
    const definitionValues = Object.values(definitions);
    const allowedItemTypes = [3]; // https://bungie-net.github.io/multi/schema_Destiny-DestinyItemType.html#schema_Destiny-DestinyItemType
    const storedInventoryItems = new Set();

    // store all specified gear
    for (let inventoryItem of definitionValues) {
        if (allowedItemTypes.includes(inventoryItem.itemType)) {

            const itemName = inventoryItem.displayProperties.name.replace('/', '').replace(',', '');
            storedInventoryItems.add({
                itemName: itemName,
                itemSubType: itemSubTypeStrings[inventoryItem.itemSubType],
                itemHash: inventoryItem.hash,
                itemRarity: inventoryItem.inventory.tierTypeName,
                iconURL: `https://www.bungie.net${inventoryItem.displayProperties.icon}`,
            });
        };
    };
    
    return storedInventoryItems;
};