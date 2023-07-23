import {getMangaFromUrl, saveBookmark, saveManga} from './storage.js';
import { getChapterFromUrl } from './url.js';

function compareChapter(a, b) {
  return parseInt(b, 10) - parseInt(a, 10);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { url } = changeInfo;
  if (url) {
    getMangaFromUrl(url).then((manga) => {
      const chapter = getChapterFromUrl(url);

      if (compareChapter(manga.chapter, chapter) > 0) {
        saveManga(manga.origin, manga.id, manga.name, chapter)
          .then(() => saveBookmark(manga.name, url));
      }
    });
  }
});
