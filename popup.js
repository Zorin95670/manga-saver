import {
  getNameFromUrl,
  getOriginFromUrl,
  getCurrentTabUrl,
  getChapterFromUrl,
  getIdFromUrl,
} from './url.js';
import {
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

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl().then((url) => {
    initForm(url);
  });

  document.getElementById('manga-form')
    .addEventListener('submit', () => {
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
    });
  document.getElementById('manager')
    .addEventListener('click', () => {
      chrome.tabs.create({ url: 'manager.html' });
    });
});
