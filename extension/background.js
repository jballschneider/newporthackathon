const identifiers = JSON.stringify([
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

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ identifiers });
  console.log('--- identifiers', identifiers)
});