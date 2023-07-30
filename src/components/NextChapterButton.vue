<template>
  <v-btn
    :icon="icon"
    :color="color"
    :loading="loading "
  />
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: true,
  },
})
const color = computed(() => {
  if (props.loading) {
    return 'grey';
  }
  return props.isAvailable ? 'success' : 'error';
});
const icon = computed(() => {
  return props.isAvailable ? 'mdi-book-play' : 'mdi-reload';
});
</script>

<style scoped>

</style>
