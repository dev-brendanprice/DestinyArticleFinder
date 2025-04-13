import { variables } from './variables.js';

// get latest release from api response
export async function getLatestRelease(releases) {

    if (!releases && !(releases?.length > 0)) { // request new release if none exists
        releases = await getReleases();
    }

    const sortedByPublishedDate =
        releases.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

    return sortedByPublishedDate[0]?.name || '0/null'; // return most recent or null if undefined
};

// get repository releases
export async function getReleases() {
    try {

        const url = `${variables.HOST}/api/v1/releases`;
        const releases = await fetch(url)
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