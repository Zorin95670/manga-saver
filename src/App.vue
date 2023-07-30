<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-responsive class="align-top text-center fill-height">
          <AppTitle title="Manga saver!"/>
<!--          <div class="py-5"/>-->
          <MainButtons/>
<!--          <div class="py-5"/>-->
          <AddMangaForm />
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import AppTitle from "@/components/AppTitle.vue";
  import AddMangaForm from "@/components/AddMangaForm.vue";
  import MainButtons from "@/components/MainButtons.vue";
</script>
