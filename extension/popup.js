// Initialize button with user's preferred color
let runExtension = document.getElementById("runExtension");

// When the button is clicked, inject setPageBackgroundColor into current page
runExtension.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scanPage,
  },
    (results) => {
      results.forEach((result) => {
        const link = document.createElement('div')
        link.innerHTML = JSON.stringify(result)
        document.getElementById("links").appendChild(link);
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

    const foundIdentifier = identifiers.find(identifier => {
      if (url.toLowerCase().includes(identifier)) {
        return identifier
      }
    });

    if (foundIdentifier) {
      return {url, foundIdentifier}
    }
    return {}
  }
}