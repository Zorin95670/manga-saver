<template>
  <v-dialog :model-value="modelValue" width="400">
    <v-card>
      <v-card-title>
        <v-icon icon="mdi-download"/>
        Import manga
      </v-card-title>
      <v-form>
        <v-card-text>
          <v-responsive>
            <v-row>
              <v-col :cols="2" style="display: flex; justify-content: right; align-items: center">
                <v-icon icon="mdi-alert" color="warning" size="large"/>
              </v-col>
              <v-col :cols="10">
                Import will <b>delete all</b> current manga to replace it by all manga in your imported file.
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                Are you sure you want to import ?
              </v-col>
            </v-row>
          </v-responsive>
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
            prepend-icon="mdi-download"
            text="Yes"
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
});
const emit = defineEmits(['update:modelValue', 'on-import']);

function confirm() {
  emit('update:modelValue', false)
  emit('on-import');
}
</script>
