// Data Selectors
const collectionDataSelectors = {
    grid: '#ProductGridContainer',
    count: '.product-count',
    hero: '.collection-hero__text-wrapper'
};

// Fetch Product Grid Container InnerHTML from the target collection page
const fetchCollectionGridContainerHTML = (url) => {
    return fetch(url)
    .then((response) => response.text())
    .then((responseText) => {
        const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
        setInnerHTML(collectionDataSelectors, responseHTML);
    })
    .catch((err) => console.error(`Failed to fetch data`, err));
};

// Set innerHTML for collection grid, hero and product count
const setInnerHTML = (selectors, responseHTML) =>{
    Object.keys(selectors).map(selectorkey => {
        let requestHTML = responseHTML.documentElement.querySelector(selectors[selectorkey]);
        let targetHTML = document.querySelector(selectors[selectorkey]);
        targetHTML.innerHTML = requestHTML.innerHTML;
    });
    
    const event = new CustomEvent('shopify-collection:product-grid-set', {
    });
    document.dispatchEvent(event);
}

// Show or Hide Loader
const collectionAjaxLoader = document.querySelector('.collection-loader');
const productsMainGrid = document.querySelector(collectionDataSelectors.grid);
const showHideLoader = (action) => {
    if(action == 'show'){
        if(collectionAjaxLoader){
            collectionAjaxLoader.classList.remove('hidden');
        }
        if(productsMainGrid){
            productsMainGrid.classList.add('hidden');
        }
    }

    if(action == 'hide'){
        if(collectionAjaxLoader){
            collectionAjaxLoader.classList.add('hidden');
        }
        if(productsMainGrid){
            productsMainGrid.classList.remove('hidden');
        }
    }
}

// When Data are Fetched
document.addEventListener('shopify-collection:product-grid-set', () => {
    // Hide Loader and Show Collection Grid
    showHideLoader('hide');

    // Scroll To Top
    document.querySelector('body').scrollIntoView({block: "start", behavior: 'smooth'});
})

// On Tab Button Click Function
const collectionTabLinks = document.querySelectorAll('a.collection-tab__link');
collectionTabLinks.forEach((tab) => {
    tab.addEventListener('click', (event) =>{
        // Prevent the default behavior
        event.preventDefault();
        
        // Change Label innerHTML for Disclosure on Mobile Devices
        document.querySelector(`#collection-name`).innerHTML = tab.dataset.collectiontitle;

        // Close Disclosure
        document.querySelector(`#collection-tabs-input`).checked = false;

        // Show Loader and Hide Collection Grid
        showHideLoader('show');

        // Fetch and load Products with the new target *Filters not affected
        const targetURL = `${tab.getAttribute('href')}${window.location.search}`;
        fetchCollectionGridContainerHTML(targetURL);

        // Change Meta Title
        var metaTitle = tab.dataset.metatitle;
        document.title = metaTitle;

        // Change the URL
        changeurl(targetURL);
    })
});


// Change url without reloading page
const changeurl = (url) => {
    window.history.pushState(null, null, url);
}