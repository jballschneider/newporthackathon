// Initialize button with user's preferred color
let runExtension = document.getElementById("runExtension");

let featuredResults = [];

// When the button is clicked, inject setPageBackgroundColor into current page
runExtension.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  //featuredResults = [];

  document.getElementById("prettyResultsContainer").innerHTML = "";

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scanPage,
  },
    (results) => {
      results.forEach((result) => {
        const link = document.createElement('div')
        link.innerHTML = JSON.stringify(result.result)
        document.getElementById("links").appendChild(link);
        Object.entries(result.result).forEach(([identifier, urlArray]) => {
            const resultEl = document.createElement('div');
            resultEl.innerHTML = `<strong>${identifier}</strong>: ${urlArray[0]}`;
            document.getElementById("prettyResultsContainer").appendChild(resultEl);
        });
        //prettyResultsContainer.getElementsById('prettyResultsContainer');
      })
    });
});


function scanPage() {

  return new Promise(resolve => {
    chrome.storage.sync.get("identifiers", (storedData) => {
      const foundURLs = {};
      const identifiers = JSON.parse(storedData.identifiers)
      const links = document.querySelectorAll('link');
      links.forEach(link => {
        const {url, foundIdentifier} = checkAndReportUrl(link.href, identifiers);
        if (!url){
          return
        }
        if (!foundURLs[foundIdentifier]) {
          foundURLs[foundIdentifier] = [url]
        } else {
          foundURLs[foundIdentifier].push(url)
        }
      });

      const scriptTags = document.querySelectorAll('script')
      scriptTags.forEach(scriptTag => {
        const {url, foundIdentifier} = checkAndReportUrl(scriptTag.src, identifiers);
        if (!url){
          return
        }
        if (!foundURLs[foundIdentifier]) {
          foundURLs[foundIdentifier] = [url]
        } else {
          foundURLs[foundIdentifier].push(url)
        }
      });
      resolve(foundURLs);
    });
  });

  function checkAndReportUrl(url, identifiers) {
    if (!url) {
      return {}
    }
    const formattedURL = new URL(url).href.toLowerCase();

    const foundIdentifier = identifiers.find(identifier => {
      if (formattedURL.includes(identifier.toLowerCase())) {
        return identifier
      }
    });

    if (foundIdentifier) {
      return { url, foundIdentifier }
    }
    return {}
  }
}