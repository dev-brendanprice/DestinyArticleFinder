
// get repository releases
export async function getReleases() {
    try {

        const url = `https://api.github.com/repos/dev-brendanprice/DestinyArticleFinder/releases`;
        const options = {
            headers: {
                // eslint-disable-next-line no-undef
                Authorization: process.env.GITHUB_FINE_GRAIN_TOKEN
            }
        };

        const releases = await fetch(url, options)
            .then(res => res.json())
            .then(data => {
                return data;
            })
            .catch(err => {
                console.error(err);
                return [];
            });
        
        return releases;
    } catch (err) {
        console.error(err);
        return [];
    };
};