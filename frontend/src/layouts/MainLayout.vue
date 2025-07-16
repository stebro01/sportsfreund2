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

        <div class="no-pointer-events text-caption">{{ store.env.APP_VERSION }}</div>
        <q-space />
        <div v-if="auth.uid" class="row items-center">
          <q-btn  size="sm" data-testid="login-menu-btn" icon="person" fit flat>
            <q-menu>
              <q-list class="text-white bg-dark" style="width: 200px">
                <q-item-section avatar></q-item-section>
                <q-item
                  clickable
                  v-close-popup
                  data-testid="copy-btn"
                  @click="copyUid"
                >
                  <q-item-section>Copy UID</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="userProfile">
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  data-testid="logout-btn"
                  @click="logout"
                >
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
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
    };
  },
  computed: {
    essentialLinks() {
      return this.store.essentialLinks;
    },
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
    logout() {
      this.auth.uid = null;
      this.auth.username = "";
      localStorage.removeItem("uid");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      this.leftDrawerOpen = false;
    },
    userProfile() {
      this.$router.push({name: 'UserStatus'});
    },
  },
};
</script>
