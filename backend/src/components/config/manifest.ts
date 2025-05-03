export default async function getLatestManifest() {
    const manifest: Object = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest/', {
        headers: {
            'X-API-Key': process.env.API_KEY
        }
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);
        });
    
    return manifest;
};