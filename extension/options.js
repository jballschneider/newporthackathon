const list = document.getElementById("list");
const input = document.getElementById('input');
const resetButton = document.getElementById('resetButton')

resetButton.addEventListener('click', () => {
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
  chrome.storage.sync.set({ identifiers });
  constructOptions();
})

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    appendListItem(e.target.value)
    input.value = ''
    updateIdentifiersInStorage();
  }
})

function updateIdentifiersInStorage() {
  const identifiers = []
  list.querySelectorAll('li > div').forEach(l => identifiers.push(l.innerText));
  chrome.storage.sync.set({ identifiers: JSON.stringify(identifiers) });
}

function constructOptions() {
  chrome.storage.sync.get("identifiers", data => {
    list.innerHTML = '';
    const identifiers = JSON.parse(data.identifiers);
    for (let identifier of identifiers) {
      appendListItem(identifier)
    }
  });
}

function appendListItem(value) {
  let listItem = document.createElement("li");

  const textDiv = document.createElement('div')
  textDiv.innerText = value;
  listItem.appendChild(textDiv);

  const removeButton = document.createElement('img');
  removeButton.src = 'cancel.svg'
  removeButton.onclick = () => {
    listItem.remove();
    updateIdentifiersInStorage();
  }
  listItem.appendChild(removeButton)

  list.appendChild(listItem);
}

constructOptions();