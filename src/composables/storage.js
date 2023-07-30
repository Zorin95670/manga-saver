export function getMangaFromUrl(url, rejectOnNotFound = false) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['key'], (result) => {
      if (!result) {
        reject();
        return;
      }
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

export function saveManga(manga) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['key'], (result) => {
      let data = result.key;
      if (!data) {
        data = {}
      }

      data[manga.id] = manga;

      chrome.storage.sync.set({ key: data }, function() {
        resolve();
      });
    });
  });
}

export async function updateManga(oldManga, newManga) {
  await deleteManga(oldManga);
  await saveManga(newManga);
  await saveBookmark(newManga.name, newManga.url);
}

export function createBookmark(bookmark) {
  return new Promise((resolve) => chrome.bookmarks.create(bookmark, resolve));
}

export function updateBookmark(id, bookmark) {
  return new Promise((resolve) => chrome.bookmarks.update(id, bookmark, resolve));
}

export function removeBookmark(id) {
  return new Promise((resolve) => chrome.bookmarks.remove(id, resolve));
}

export function saveBookmark(name, url) {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree(async (bookmarkTreeNodes) => {
      for (const group of bookmarkTreeNodes[0].children) {
        const folder = group.children.find(({title}) => title === 'MyManga');

        if (!folder) {
          const {id} = await createBookmark({
            title: 'MyManga',
            parentId: group.id,
          });
          await createBookmark({
            title: name,
            url,
            parentId: id,
          });
          continue;
        }

        const bookmark = folder.children.find(({title}) => title === name);

        if (!bookmark) {
          await createBookmark({
            title: name,
            url,
            parentId: folder.id,
          })
          continue;
        }

        await updateBookmark(bookmark.id, { title: name, url });
      }
      resolve();
    });
  });
}

export function getData() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['key'], (result) => {
      if (result) {
        resolve(result.key);
      }
    });
  });
}

export function deleteManga(manga) {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree(async (bookmarkTreeNodes) => {
      for (const group of bookmarkTreeNodes[0].children) {
        const folder = group.children.find(({title}) => title === 'MyManga');

        if (!folder) {
          continue;
        }

        const bookmark = folder.children.find(({title}) => title === manga.name);

        if (!bookmark) {
          continue;
        }

        await removeBookmark(bookmark.id);
      }

      chrome.storage.sync.get(['key'], (result) => {
        const data = result.key;
        if (data && data[manga.id]) {
          delete data[manga.id];

          chrome.storage.sync.set({ key: data }, function() {
            resolve();
          });
        }
      });
    });
  });
}
