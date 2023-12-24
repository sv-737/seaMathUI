<template>
  <v-app>
    <v-app-bar title="sea.math.teacher">
      <v-spacer />
      <div class="d-flex ga-1">
        <v-btn to="/lc/schedule" variant="text">Расписание</v-btn>
        <v-btn to="/lc/working-hours" variant="text">Рабочие часы</v-btn>
        <v-btn to="/lc/students" variant="text">Ученики</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>
