<template>
  <v-dialog :model-value="modelValue" width="400">
    <v-card>
      <v-card-title>
        <v-icon icon="mdi-delete"/>
        Delete manga
      </v-card-title>
      <v-form>
        <v-card-text>
          Are you sure, you wanted to delete '{{ manga?.name }}' ?
        </v-card-text>
        <v-card-actions class="flex justify-end">
          <v-btn
            variant="tonal"
            color="error"
            @click="$emit('update:modelValue', false)"
            prepend-icon="mdi-close"
            text="No"
          />
          <v-btn
            variant="tonal"
            color="success"
            prepend-icon="mdi-delete"
            text="Yes"
            :loading="loading"
            @click="confirm"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref} from "vue";
import {deleteManga} from "@/composables/storage";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  manga: {
    type: Object,
    default: null,
  }
});
const emit = defineEmits(['update:modelValue', 'on-delete']);
const loading = ref(false);

function confirm() {
  loading.value = true;

  deleteManga(props.manga)
    .finally(() => {
      loading.value = false;

      emit('update:modelValue', false)
      emit('on-delete');
    });
}
</script>
