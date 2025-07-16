<template>
  <q-page class="row items-center justify-center">
    <div class="column q-gutter-sm" style="width: 300px">
      <q-input v-model="username" label="Username" />
      <q-input v-model="password" type="password" label="Password" />
      <q-btn label="Register" color="primary" @click="doRegister" />
      <q-btn
        label="Back to Login"
        flat
        @click="$router.push({ name: 'Login' })"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "stores/authStore";

const store = useAuthStore();
const username = ref("");
const password = ref("");

const doRegister = async () => {
  await store.register(username.value, password.value);
};
</script>
