<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-responsive class="align-top text-center fill-height">
          <v-row>
            <v-col>
              <AppTitle title="Check new chapters!"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                class="mx-2"
                color="blue"
                prepend-icon="mdi-upload"
                text="Export all data"
                @click="exportData"
              />
              <input
                type="file"
                id="my_file"
                accept=".json"
                style="display: none"
                @change="importData"
              >
              <v-btn
                class="mx-2"
                color="warning"
                prepend-icon="mdi-download"
                text="Import all data"
                :loading="importLoading"
                @click="onImport"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <MangaTable
                v-model="allManga"
                @on-delete="onDelete"
                @on-edit="onEdit"
                @on-open="onOpen"
                @on-reload="onReload"
                @on-update="init"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <PaypalGift/>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                prepend-icon="mdi-chat-processing"
                color="blue"
                text="Feedback"
                @click="openUrl('https://github.com/zorin95670/manga-saver/issues/new/choose')"
              />
            </v-col>
          </v-row>
        </v-responsive>
        <EditMangaDialog
          v-if="editDialog"
          v-model="editDialog"
          :manga="manga"
          @on-edit="init"
        />
        <DeleteMangaDialog
          v-if="deleteDialog"
          v-model="deleteDialog"
          :manga="manga"
          @on-delete="init"
        />
        <ImportMangaDialog
          v-if="importDialog"
          v-model="importDialog"
          @on-import="openFile"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import AppTitle from "@/components/AppTitle.vue";
import MangaTable from "@/components/MangaTable.vue";
import EditMangaDialog from "@/components/EditMangaDialog.vue";
import {onMounted, ref} from "vue";
import DeleteMangaDialog from "@/components/DeleteMangaDialog.vue";
import ImportMangaDialog from "@/components/ImportMangaDialog.vue";
import PaypalGift from "@/components/PaypalGift.vue";
import {getData, saveBookmark, saveManga} from "@/composables/storage";
import {getChapterFromUrl, openUrl} from "@/composables/url";

const deleteDialog = ref(false);
const editDialog = ref(false);
const importDialog = ref(false);
const allManga = ref([]);
const manga = ref(null);
const importLoading = ref(false);

function onEdit(id) {
  manga.value = allManga.value.find((manga) => manga.id === id);
  editDialog.value = true;
}

function onDelete(id) {
  manga.value = allManga.value.find((manga) => manga.id === id);
  deleteDialog.value = true;
}

function onReload(id) {
  checkNext(allManga.value.find((manga) => manga.id === id));
}

function onOpen(id) {
  const manga = allManga.value.find((manga) => manga.id === id);
  const url = getNextUrl(manga);
  const chapter = getChapterFromUrl(url);

  saveManga({
    ...manga,
    url,
    chapter,
  }).then(() => saveBookmark(manga.name, url))
    .then(() => {
      chrome.tabs.create({ url });
      return init();
    });
}

function getNextUrl(manga) {
  const oldVersion = `${manga.chapter}`.replace('.', '-');
  const newVersion = `${parseInt(manga.chapter + 1)}`.replace('.', '-');

  return `${manga.url}`.replace(oldVersion, newVersion);
}

function checkNext(manga) {
  const url = getNextUrl(manga);
  fetch(url, {
    method: 'HEAD',
    mode: 'no-cors',
  }).then(response => {
    manga.available = response.ok;
    manga.loading = false;
  }).catch(() => {
    manga.loading = false;
  })
}

function checkLast(manga) {
  manga.last = '-';

  if (!manga.chaptersUrl) {
    manga.lastLoading = false;
    return;
  }

  manga.lastLoading = true;

  fetch(manga.chaptersUrl, {
    method: 'GET',
    mode: 'no-cors',
  }).then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = '';
    const readStream = () => {
      return reader.read().then(({ done, value }) => {
        if (done) {
          return result;
        }

        result += decoder.decode(value, { stream: true });
        return readStream();
      });
    };

    readStream().then((streamData) => {
      const iterator = streamData.matchAll(`href="(${manga.url.replace(manga.chapter + '/', '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}[0-9]*\/)"`);
      let max = 0;

      let result = iterator.next();
      while (!result.done) {
        const value = result.value;
        const chapter = getChapterFromUrl(value[1]);

        if (chapter > max) {
          max = chapter;
        }
        result = iterator.next();
      }

      manga.lastLoading = false;
      manga.last = max;
    });
  }).catch(() => {
    manga.lastLoading = false;
    manga.last = '-';
  })
}

async function exportData() {
  const data = await getData();
  const blob = new Blob([JSON.stringify(
    Object.keys(data).map((key) => data[key]),
    (key, value) => (value === null ? undefined : value),
    2,
  )], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = url;
  downloadLink.download = `my-manga_${Date.now()}.json`;
  downloadLink.style.display = 'none';

  document.body.appendChild(downloadLink);
  downloadLink.click();

  URL.revokeObjectURL(url);
}

function onImport() {
  importDialog.value = true;
}

function openFile() {
  importLoading.value = true;
  document.getElementById('my_file').click();
}

function importData(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = async ({target}) => {
      const data = JSON.parse(target.result);
      const oldManga = (await getData()) || {};

      for (const id in Object.keys(oldManga)) {
        await deleteManga(oldManga[id]);
      }

      for(const index in data) {
        await saveManga(data[index]);
        await saveBookmark(data[index].name, data[index].url);
      }

      await init();

      importLoading.value = false;
    };
    reader.readAsText(file);
  }

}

function init() {
  return getData().then((data) => {
    if (!data || Object.keys(data).length === 0) {
      allManga.value = [];
      return;
    }

    allManga.value = Object.keys(data)
      .map((key) => data[key])
      .map((manga) => ({
        ...manga,
        chapter: getChapterFromUrl(manga.url),
        loading: true,
        available: false,
      }));

    allManga.value.forEach(checkNext);

    allManga.value.forEach(checkLast);
  });
}

onMounted(() => {
  init();
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.id === chrome.runtime.id && request.type === 'Update') {
      init();
    }
  });
})
</script>
