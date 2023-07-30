<template>
  <v-form @submit.prevent="submit">
    <v-responsive>
      <v-row style="margin:0px">
        <v-col style="padding-bottom: 0">
          <v-tooltip location="bottom">
            <span>
              URL of your last readed chapter.
            </span>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                variant="outlined"
                v-model="url"
                label="URL"
                :rules="[required]"
                :clearable="true"
                @change="updateChapter"
              />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row style="margin:0px">
        <v-col style="padding-bottom: 0">
          <v-tooltip location="bottom">
            <span>
              URL that list all chapters of your manga.
            </span>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                variant="outlined"
                v-model="chaptersUrl"
                label="All chapters URL"
                :clearable="true"
              />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row style="margin:0px">
        <v-col style="padding-bottom: 0">
          <v-tooltip location="bottom">
            <span>
              URL used to identify your manga and update URL of your last readed chapter.
            </span>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                variant="outlined"
                v-model="id"
                label="Id"
                :rules="[required]"
                :clearable="true"
              />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row style="margin:0px">
        <v-col cols="3" style="padding-bottom: 0">

          <v-tooltip location="bottom">
            <span>
              chapter number of the selected URL.
            </span>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                variant="outlined"
                v-model="chapter"
                type="number"
                label="Chapter"
                :disabled="true"
              />
            </template>
          </v-tooltip>
        </v-col>
        <v-col cols="9" style="padding-bottom: 0">
          <v-tooltip location="bottom">
            <span>
              Bookmark name to properly name your manga in the bookmark folder.
            </span>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                variant="outlined"
                v-model="name"
                label="Bookmark name"
                :rules="[required]"
                :clearable="true"
              />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row style="margin:0px">
        <v-col style="padding: 0">
          <v-btn
            prepend-icon="mdi-content-save"
            :loading="loading"
            type="submit"
            color="success"
            class="mt-2"
            text="Add new manga"
          />
        </v-col>
      </v-row>
    </v-responsive>
  </v-form>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {saveBookmark, saveManga} from "@/composables/storage";
import {getChapterFromUrl, getCurrentTabUrl, getIdFromUrl, getNameFromUrl} from "@/composables/url";

const required = ref((v) => !!v || 'Field is required');
const url = ref('');
const id = ref('');
const name = ref('');
const chapter = ref(null);
const chaptersUrl = ref(null);
const loading = ref(false);

async function submit() {
  loading.value = true;
  saveManga({
    url: url.value,
    id: id.value,
    name: name.value,
    chapter: chapter.value,
    chaptersUrl: chaptersUrl.value,
  }).then(() => {
    return saveBookmark(name.value, url.value);
  }).then(() => {
    setTimeout(() => {
      loading.value = false;
      window.close();
    }, 2000);
  });
}

function update() {
  chapter.value = getChapterFromUrl(url.value);
}

onMounted(() => {
  getCurrentTabUrl().then((currentUrl) => {
    url.value = currentUrl;
    id.value = getIdFromUrl(currentUrl);
    chaptersUrl.value = getIdFromUrl(currentUrl);
    chapter.value = getChapterFromUrl(currentUrl);
    let value = getNameFromUrl(currentUrl);

    if (value) {
      name.value = value
        .replaceAll('-', ' ')
        .toLowerCase()
        .replace(value[0], value[0].toUpperCase());
    }
  });
});
</script>

<style scoped>

</style>
