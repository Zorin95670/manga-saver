import {
  getNameFromUrl,
  getOriginFromUrl,
} from './url.js';

export function getMangaFromUrl(url, rejectOnNotFound = false) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['key'], (result) => {
      const manga = Object.keys(result.key)
        .map((key) => result.key[key])
        .find((manga) => url.startsWith(manga.id));

      if (manga) {
        resolve(manga);
        return
      }

      if (rejectOnNotFound) {
        reject();
      }
    });
  });
}

export function saveManga(origin, id, name, chapter) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['key'], (result) => {
      let data = result.key;
      if (!result.key) {
        data = {}
      }

      data[id] = { origin, id, name, chapter };

      chrome.storage.sync.set({ key: data }, function() {
        resolve();
      });
    });
  });
}

export function saveBookmark(name, url) {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    bookmarkTreeNodes[0].children.forEach((group) => {
      const folder = group.children.find(({ title }) => title === 'MyManga');

      if (!folder) {
        console.log('NOT_EXIST');
        chrome.bookmarks.create({
          title: 'MyManga',
          parentId: group.id,
        } , (newFolder) => {
          chrome.bookmarks.create({
            title: name,
            url,
            parentId: newFolder.id,
          });
        });
        return;
      }

      const bookmark = folder.children.find(({ title }) => title === name);

      if (!bookmark) {
        chrome.bookmarks.create({
          title: name,
          url,
          parentId: folder.id,
        });
        return;
      }

      chrome.bookmarks.update(bookmark.id, { title: name, url });
    })
  });
}
