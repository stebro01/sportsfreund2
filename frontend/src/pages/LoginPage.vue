<template>
  <q-page class="row items-center justify-center">
    <div class="column q-gutter-sm" style="width: 300px">
      <q-input v-model="username" label="Username" />
      <q-input v-model="password" type="password" label="Password" />
      <q-btn label="Login" color="primary" @click="doLogin" />
      <q-btn label="Register" flat @click="doRegister" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "stores/authStore";

const store = useAuthStore();
const username = ref("");
const password = ref("");

const doLogin = async () => {
  await store.login(username.value, password.value);
};

const doRegister = async () => {
  await store.register(username.value, password.value);
};
</script>
