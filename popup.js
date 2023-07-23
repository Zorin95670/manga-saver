import {
  getNameFromUrl,
  getOriginFromUrl,
  getCurrentTabUrl,
  getChapterFromUrl,
  getIdFromUrl,
} from './url.js';
import {
  getData,
  saveBookmark,
  saveManga
} from './storage.js';

function initForm(url) {
  document.querySelector('input[name="url"]').value = url;
  document.querySelector('input[name="origin"]').value = getOriginFromUrl(url);
  document.querySelector('input[name="chapter"]').value = getChapterFromUrl(url);
  document.querySelector('input[name="name"]').value = getNameFromUrl(url);
  document.querySelector('input[name="id"]').value = getIdFromUrl(url);
}

function onSubmit() {
  const url = document.querySelector('input[name="url"]').value;
  const origin = document.querySelector('input[name="origin"]').value;
  const chapter = document.querySelector('input[name="chapter"]').value;
  const name = document.querySelector('input[name="name"]').value;
  const id = document.querySelector('input[name="id"]').value;

  saveManga(origin, id, name, chapter).then(() => {
    return saveBookmark(name, url);
  }).then(() => {
    window.close();
  });
}

function goToManager() {
  chrome.tabs.create({ url: 'manager.html' });
}

function exportData() {
  getData().then((data) => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = url;
    downloadLink.download = 'my-mang.json';
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();

    URL.revokeObjectURL(url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl().then(initForm);

  document.getElementById('manga-form').addEventListener('submit', onSubmit);
  document.getElementById('manager').addEventListener('click', goToManager);
  document.getElementById('export').addEventListener('click', exportData);
});
