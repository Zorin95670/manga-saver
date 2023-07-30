<template>
  <v-table style="display: inline-flex">
    <thead>
    <tr>
      <th>
        Name
      </th>
      <th>
        Current chapter
      </th>
      <th>
        Last chapter
      </th>
      <th class="text-center" style="max-width: 85px; width: 85px">
        Continue reading
      </th>
      <th class="text-center" style="max-width: 85px; width: 85px">
        All chapters
      </th>
      <th class="text-center" style="max-width: 85px; width: 85px">
        Read next
      </th>
      <th class="text-center" style="max-width: 85px; width: 85px">
        Edit
      </th>
      <th class="text-center" style="max-width: 85px; width: 85px">
        Delete
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="item in items"
      :key="item.id"
    >
      <td class="text-left">
        {{ item.name }}
      </td>
      <td class="text-center">
        {{ item.chapter }}
      </td>
      <td class="text-center">
        <template v-if="item.lastLoading">
          <v-progress-circular indeterminate/>
        </template>
        <template v-else>
          {{ item.last }}
        </template>
      </td>
      <td>
        <v-btn
          icon="mdi-book-open-variant"
          color="success"
          :rounded="0"
          density="comfortable"
          @click="openUrl(item.url)"
        />
      </td>
      <td>
        <v-btn
          icon="mdi-format-list-numbered"
          color="success"
          :rounded="0"
          density="comfortable"
          @click="openUrl(item.chaptersUrl)"
        />
      </td>
      <td>
        <NextChapterButton
          :loading="item.loading"
          :is-available="item.available"
          :rounded="0"
          density="comfortable"
          @click="nextAction(item)"
        />
      </td>
      <td>
        <v-btn
          icon="mdi-pencil"
          color="warning"
          :rounded="0"
          density="comfortable"
          @click="$emit('on-edit', item.id)"
        />
      </td>
      <td>
        <v-btn
          icon="mdi-delete"
          color="error"
          :rounded="0"
          density="comfortable"
          @click="$emit('on-delete', item.id)"
        />
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import {computed} from "vue";
import {getChapterFromUrl, openUrl} from "@/composables/url";
import {saveBookmark, saveManga} from "@/composables/storage";
import NextChapterButton from "@/components/NextChapterButton.vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  }
})
const emit = defineEmits(['on-delete', 'on-edit', 'on-open', 'on-reload','on-update']);
const items = computed(() => props.modelValue);

function nextAction(manga) {
  if (manga.loading) return;

  if (manga.available) {
    emit('on-open', manga.id);
  } else {
    emit('on-reload', manga.id);
  }
}
</script>
