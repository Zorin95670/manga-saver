import {getMangaFromUrl, saveBookmark, saveManga} from './storage.js';
import {getChapterFromUrl, getCurrentTabUrl} from './url.js';

function compareChapter(a, b) {
  return parseFloat(b) - parseFloat(a);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { url } = changeInfo;
  if (url) {
    getMangaFromUrl(url).then((manga) => {
      const chapter = getChapterFromUrl(url);

      if (compareChapter(manga.chapter, chapter) > 0) {
        saveManga({ ...manga, url, chapter })
          .then(() => saveBookmark(manga.name, url));
      }
    });
  }
});

chrome.tabs.onActivated.addListener(() => {
  getCurrentTabUrl().then((url) => {
    if (`chrome-extension://${chrome.runtime.id}/check/index.html` === url) {
      chrome.runtime.sendMessage({ type: 'Update', id: chrome.runtime.id });
    }
  });
})
