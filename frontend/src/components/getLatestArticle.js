import { variables } from './config/variables.js';

export async function getLatestArticle() {
    const url = `${variables.API_HOST}/api/v1/latestArticle`;
    const latestArticle = await fetch(url)
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);
            return [];
        });
    
    return latestArticle;
};

export async function checkLatestArticle() {
    const latestArticle = await getLatestArticle();
    const storedArticle = JSON.parse(window.localStorage.getItem('latestSavedArticle'));

    // show css animation
    function notify() {

        const wrapper = document.getElementById('bungieLogoWrapper');
        wrapper.classList.add('newItemSwishWrapper');
        wrapper.addEventListener('click', () => {

            // change client location to this url
            const url = `${window.location.origin}/article?a=${latestArticle.hostedUrl}&m=true`;
            window.location = url;
        });
    };

    // if no pre-existing article OR
    // if (pre-existing) stored article is older than latest article
    if ((!storedArticle) || (storedArticle && new Date(storedArticle.date) < new Date(latestArticle.date))) {
        window.localStorage.setItem('latestSavedArticle', JSON.stringify(latestArticle));
        notify();
        return;
    };
};
