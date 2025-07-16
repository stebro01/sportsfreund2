<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-icon
          class="cursor-pointer"
          name="img:icons/favicon-96x96.png"
          size="sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title class="text-center no-pointer-events">
          {{ store.env.APP_NAME }}
        </q-toolbar-title>

        <div class="no-pointer-events">{{ store.env.APP_VERSION }}</div>
        <q-space />
        <div v-if="auth.uid" class="row items-center">
          <span class="q-mr-xs">{{ auth.username }} ({{ auth.uid }})</span>
          <q-icon
            name="content_copy"
            class="cursor-pointer"
            data-testid="copy-btn"
            @click="copyUid"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-dark">
      <q-list>
        <q-item-label header class="no-pointer-events non-selectable">
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          :el="link"
        />
      </q-list>
      <div class="text-center q-pa-lg">
        <q-img
          class="cursor-pointer"
          src="icons/favicon-128x128.png"
          width="100px"
          @click="$router.push({ name: 'About' })"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-icon name="circle" :color="apiColor" size="12px">
          <q-tooltip>{{ apiTooltip }}</q-tooltip>
        </q-icon>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { useAppStore } from "stores/appStore";
import { useErrorStore } from "stores/errorStore";
import { useAuthStore } from "stores/authStore";
import { useApiStore } from "stores/apiStore";

export default {
  name: "MainLayout",
  components: {
    EssentialLink,
  },
  setup() {
    const store = useAppStore();
    const errorStore = useErrorStore();
    const auth = useAuthStore();
    const apiStore = useApiStore();
    return { store, errorStore, auth, apiStore };
  },
  mounted() {
    this.store.log("MainLayout.vue::mounted()");
    this.apiStore.get("/ping").catch(() => {});
  },
  data() {
    return {
      toggleLeftDrawer: false,
      leftDrawerOpen: false,
      essentialLinks: this.store.getEssentialLinks,
    };
  },
  computed: {
    apiColor() {
      if (this.errorStore.apiStatus === "ok") return "green";
      if (this.errorStore.apiStatus === "error") return "red";
      return "grey";
    },
    apiTooltip() {
      if (this.errorStore.apiStatus === "ok") return "Server reachable";
      return this.errorStore.lastError || "";
    },
  },
  methods: {
    copyUid() {
      if (this.auth.uid) {
        navigator.clipboard.writeText(this.auth.uid);
      }
    },
  },
};
</script>
