<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary ">
      <q-toolbar>
        <q-icon class="cursor-pointer" name="img:icons/favicon-96x96.png" size="sm"
          @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-center no-pointer-events">
          {{ $store.getters.ENV.APP_NAME }}
        </q-toolbar-title>

        <div class="no-pointer-events">{{ $store.getters.ENV.APP_VERSION }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-dark">
      <q-list>
        <q-item-label header class="no-pointer-events non-selectable">
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" :el="link" />
      </q-list>
      <div class="text-center q-pa-lg">
        <q-img class="cursor-pointer" src="icons/favicon-128x128.png" width="100px"
          @click="$router.push({ name: 'About' })" />
      </div>
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
