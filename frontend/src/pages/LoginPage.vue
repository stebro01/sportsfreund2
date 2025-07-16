<template>
  <q-page class="column items-center justify-center">
    <div class="text-h5 q-mb-md">Login</div>
    <div class="column q-gutter-sm" style="width: 300px">
      <q-input v-model="username" label="Username" input-class="text-white" label-color="grey-7" />
      <q-input v-model="password" type="password" label="Password" input-class="text-white" label-color="grey-7" />
      <q-btn label="Login" color="primary" @click="doLogin" />
      <q-btn label="Register" flat @click="doRegister" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/authStore";

const store = useAuthStore();
const username = ref("");
const password = ref("");
const router = useRouter();
const $q = useQuasar();

const doLogin = async () => {
  try {
    await store.login(username.value, password.value);
    $q.notify({ type: "positive", message: "Login successful" });
    router.push("/");
  } catch (err) {
    const msg = err.response?.data?.detail || err.message;
    $q.notify({ type: "negative", message: msg });
  }
};

const doRegister = async () => {
  router.push("/register");
};
</script>
