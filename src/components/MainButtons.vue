<template>
  <v-row class="d-flex align-center justify-center">
    <v-col cols="auto">
      <v-btn
        color="blue"
        rel="noopener noreferrer"
        @click="open('check/index.html')"
      >
        <v-icon
          icon="mdi-alert-decagram"
          size="large"
          start
        />
        Check chapter release
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
function open(url) {
  chrome.tabs.create({ url });
}
</script>
