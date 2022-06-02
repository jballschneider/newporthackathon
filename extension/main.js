const identifiers = new Set([
    "zdassets",
    "force",
    "livechat",
    "now",
    "aem",
    "coveo",
    "algolia",
    "elastic",
    "lucid",
    "searchunify",
    "demandware",
    "uberall",
    "where2buy"
]);

var links = document.querySelectorAll("link")
links.forEach((link) => {
    identifiers.forEach((identifier) => {
        if (link.href.toLowerCase().includes(identifier)) {
            console.log("found link href: ", link.href);
        }
    })
})