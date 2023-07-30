<template>
  <v-dialog :model-value="modelValue" style="max-width: 500px">
    <v-card>
      <v-card-title>
        <v-icon icon="mdi-pencil"/>
        Edit manga
      </v-card-title>
      <v-form>
        <v-card-text>
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
              />
            </template>
          </v-tooltip>
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
        </v-card-text>
        <v-card-actions class="flex justify-end">
          <v-btn
            color="error"
            @click="$emit('update:modelValue', false)"
            prepend-icon="mdi-close"
            text="Close"
          />
          <v-btn
            :loading="loading"
            color="success"
            prepend-icon="mdi-content-save"
            text="Update"
            :disabled="!updatable"
            @click="update"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {deleteManga, updateManga} from "@/composables/storage";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  manga: {
    type: Object,
    default: () => null,
  }
});
const emit = defineEmits(['update:modelValue', 'on-edit']);

const required = ref((v) => !!v || 'Field is required');
const loading = ref(false);
const dialog = ref(false);
const url = ref(props.manga.url);
const chaptersUrl = ref(props.manga.chaptersUrl);
const id = ref(props.manga.id);
const name = ref(props.manga.name);
const updatable = computed(() => props.manga.url !== url.value
  || props.manga.chaptersUrl !== chaptersUrl.value
  || props.manga.id !== id.value
  || props.manga.name !== name.value
);

function update() {
  loading.value = true;

  updateManga(props.manga, {
    url: url.value,
    chaptersUrl: chaptersUrl.value,
    id: id.value,
    name: name.value
  })
    .finally(() => {
      loading.value = false;

      emit('update:modelValue', false)
      emit('on-edit', props.manga.id);
    });
}

watch(() => props.manga, () => {
  if (props.manga) {
    url.value = props.manga.url;
    id.value = props.manga.id;
    name.value = props.manga.name;
  }
});
</script>
