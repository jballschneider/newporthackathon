main();

function main() {
    console.log('--- running yext extension')
    const links = document.querySelectorAll('link');
    links.forEach(link => checkAndReportUrl(link.href));
    
    const scriptTags = document.querySelectorAll('script')
    scriptTags.forEach(scriptTag => checkAndReportUrl(scriptTag.src));
}

function checkAndReportUrl(url) {
    if (!url) {
        return
    }
    
    const identifiers = new Set([
        'zdassets',
        'force',
        'livechat',
        'now',
        'aem',
        'coveo',
        'algolia',
        'elastic',
        'lucid',
        'searchunify',
        'demandware',
        'uberall',
        'where2buy'
    ]);

    identifiers.forEach(identifier => {
        if (url.toLowerCase().includes(identifier)) {
            console.log('found link url: ', url)
        }
    });
}