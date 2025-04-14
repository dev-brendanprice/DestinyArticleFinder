// also configures events for each control (button)
export function addImageControls() {
    const els = document.getElementsByClassName('articleImageContainer');

    for (let imageContainer of els) {
        const imageControls = document.createElement('div');
        const imageCtrlLink = document.createElement('div');
        const imageCtrlDownload = document.createElement('a');
        const imageCtrlOpen = document.createElement('div');
        const imageCtrlMore = document.createElement('div');
        const icoMagnify = document.createElement('img');
        const icoDownload = document.createElement('img');
        const icoOpen = document.createElement('img');

        // const icoMore = document.createElement('img');

        imageControls.className = 'imageControls';
        imageCtrlLink.className = 'imageCtrl';
        imageCtrlDownload.className = 'imageCtrl';
        imageCtrlOpen.className = 'imageCtrl';

        // imageCtrlMore.className = 'imageCtrl';
        icoMagnify.className = 'imageCtrlInner';
        icoDownload.className = 'imageCtrlInner';
        icoOpen.className = 'imageCtrlInner';

        // icoMore.className = 'imageCtrlInner';

        icoMagnify.src = './assets/link.svg';
        icoDownload.src = './assets/download.svg';
        icoOpen.src = './assets/open.svg';

        // icoMore.src = './assets/more.svg';

        // for "More" context menu
        // const ctrlMoreContainer = document.createElement('div');
        // const moreCopyContainer = document.createElement('div');
        // const moreCopyText = document.createElement('div');
        // const moreCopyIco = document.createElement('img');
        // const moreLinkContainer = document.createElement('div');
        // const moreLinkText = document.createElement('div');
        // const moreLinkIco = document.createElement('img');

        // ctrlMoreContainer.className = 'ctrlMoreContainer';
        // moreCopyContainer.className = 'ctrlMoreItem';
        // moreLinkContainer.className = 'ctrlMoreItem';
        // moreCopyText.className = 'ctrlMoreItemText';
        // moreLinkText.className = 'ctrlMoreItemText';
        // moreCopyIco.className = 'ctrlMoreItemIco';
        // moreLinkIco.className = 'ctrlMoreItemIco';

        // moreCopyText.innerHTML = 'Copy Image';
        // moreLinkText.innerHTML = 'Copy Link';
        // moreCopyIco.src = './assets/copy.svg';
        // moreLinkIco.src = './assets/link.svg';

        let imageURL = imageContainer.querySelector('img').src;
        imageURL = imageURL.split('?')[0]; // remove URI query params

        // if image src is incorrectly set
        if (imageURL.includes(window.location.origin)) {
            const fixedImageURL = `https://www.bungie.net${imageURL.split(window.location.origin)[1]}`;
            imageContainer.querySelector('img').src = fixedImageURL;
        };

        // config events // keep commented code here just in case i find more info to grab from the image
        // imageCtrlMore.style.display = 'none';
        // imageCtrlMore.addEventListener('click', () => {
        //     if (getComputedStyle(ctrlMoreContainer).display === 'none') {
        //         ctrlMoreContainer.style.display = 'flex';
        //         imageControls.style.opacity = '1';
        //         imageCtrlMore.style.backgroundColor = '#3b3d42';
        //         return;
        //     };
        //     ctrlMoreContainer.style.display = 'none'; // else
        //     imageControls.style.opacity = '';
        //     imageCtrlMore.style.backgroundColor = '';
        // });

        // moreLinkContainer.addEventListener('click', () => {
        //     navigator.clipboard.writeText(`${imageURL}`);
        // });
        imageCtrlLink.addEventListener('click', () => {
            navigator.clipboard.writeText(`${imageURL}`);
        });

        imageCtrlDownload.href = '';
        imageCtrlDownload.download = `${imageURL}`;

        imageCtrlOpen.addEventListener('click', () => {
            window.open(imageURL, '_blank').focus();
        });

        // moreCopyContainer.append(moreCopyText, moreCopyIco);
        // moreLinkContainer.append(moreLinkText, moreLinkIco);
        // ctrlMoreContainer.append(moreCopyContainer, moreLinkContainer);

        // build all controls
        imageCtrlLink.appendChild(icoMagnify);
        imageCtrlDownload.appendChild(icoDownload);
        imageCtrlOpen.appendChild(icoOpen);

        // imageCtrlMore.appendChild(icoMore);
        imageControls.append(imageCtrlLink, imageCtrlDownload, imageCtrlOpen, imageCtrlMore);
        imageContainer.append(imageControls);

        // imageContainer.append(imageControls, ctrlMoreContainer);
    }
}
