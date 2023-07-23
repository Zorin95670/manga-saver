export function getCurrentTabUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        resolve(tabs[0].url);
      }
    });
  });
}

export function getOriginFromUrl(url) {
  const origin = url.match(/^(https?:\/\/[^/]+)/);

  return origin ? origin[1] : null;
}

export function getNameFromUrl(url) {
  const name = url.match(/https:\/\/[^/]+\/[^/]+\/([^/]+)/);

  return name ? name[1] : null;
}

export function getIdFromUrl(url) {
  const id = /https:\/\/[^/]+\/[^/]+\/[^/]+/.exec(url);

  return id ? id[0] : null;
}

export function getChapterFromUrl(url) {
  const chapter = url.match(/(\d+(-\d+)?)\/?$/);

  if (chapter) {
    return parseFloat(chapter[1].replace('-', '.'));
  }

  return null;
}
