<template>
  <q-page class="flex flex-center">
    <q-img alt="Quasar logo" src="~assets/arni_logo.png" height="300px" />

    <div class="absolute-center row q-gutter-lg justify-center">
      <q-btn no-caps class="my-main-btn" @click="$router.push({ name: 'QuickTimer' })">Starte Timer</q-btn>
      <q-btn no-caps class="my-main-btn" @click="$router.push({ name: 'ProgramTimer' })">Starte Programm</q-btn>
      <q-btn no-caps class="my-main-btn" @click="$router.push({ name: 'InviteFriends' })">Freund einladen</q-btn>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',

  methods: {
    commingSoon() {
      this.$q.notify({
        message: 'Diese Funktion ist noch nicht verfügbar',
        color: 'red-5',
        icon: 'report_problem',
        timeout: 2000
      })
    }
  }
})
</script>
