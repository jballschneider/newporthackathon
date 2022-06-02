// Initialize button with user's preferred color
let runExtension = document.getElementById("runExtension");

// When the button is clicked, inject setPageBackgroundColor into current page
runExtension.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scanPage,
  });
});


function scanPage() {
  console.log('--- running yext extension');

  chrome.storage.sync.get("identifiers", (storedData) => {
    const identifiers = JSON.parse(storedData.identifiers)
    console.log('--- using identifiers', identifiers)

    const links = document.querySelectorAll('link');
    links.forEach(link => checkAndReportUrl(link.href, identifiers));

    const scriptTags = document.querySelectorAll('script')
    scriptTags.forEach(scriptTag => checkAndReportUrl(scriptTag.src, identifiers));
  });

  function checkAndReportUrl(url, identifiers) {
    if (!url) {
      return
    }

    identifiers.forEach(identifier => {
      if (url.toLowerCase().includes(identifier)) {
        console.log('found link url: ', url)
      }
    });
  }
}