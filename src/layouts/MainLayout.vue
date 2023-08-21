<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          {{ $store.getters.ENV.APP_NAME }}
        </q-toolbar-title>

        <div>{{ $store.getters.ENV.APP_VERSION }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-dark">
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" :el="link" />
      </q-list>
    </q-drawer>

    <q-page-container>

      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script>
import EssentialLink from 'components/EssentialLink.vue'

export default {
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  mounted() {
    this.$store.commit('LOG', 'MainLayout.vue::mounted()')
  },
  data() {
    return {
      toggleLeftDrawer: false,
      leftDrawerOpen: false,
      essentialLinks: this.$store.getters.ESSENTIAL_LINKS
    }
  },
  computed: {

  }
}
</script>
