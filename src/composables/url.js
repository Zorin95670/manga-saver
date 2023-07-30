export function getCurrentTabUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        resolve(tabs[0].url);
      }
    });
  });
}

export function getNameFromUrl(url) {
  const name = /https:\/\/[^/]+\/[^/]+\/([^/]+)/.exec(url);

  return name ? name[1] : null;
}

export function getIdFromUrl(url) {
  const id = /https:\/\/[^/]+\/[^/]+\/[^/]+/.exec(url);

  return id ? id[0] : null;
}

export function getChapterFromUrl(url) {
  const chapter = /(\d+(-\d+)?)\/?$/.exec(url);

  if (chapter) {
    return parseFloat(chapter[1].replace('-', '.'));
  }

  return null;
}

export function openUrl(url) {
  chrome.tabs.create({ url });
}
