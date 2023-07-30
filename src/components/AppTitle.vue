<script setup>
  defineProps({
    title: {
      required: true,
      type: String,
    }
  })
</script>

<template>
  <v-row class="d-flex align-center justify-center">
    <v-col class="d-flex align-center justify-center">
      <v-img height="60" src="@/assets/logo.svg" max-width="60px"/>
      <h1 class="text-h3 font-weight-bold">{{ title }}</h1>
    </v-col>
  </v-row>
</template>
