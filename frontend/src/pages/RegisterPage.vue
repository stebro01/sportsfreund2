<template>
  <q-page class="column items-center justify-center">
    <div class="text-h5 q-mb-md">Register</div>
    <div class="column q-gutter-sm" style="width: 300px">
      <q-input v-model="username" label="Username" input-class="text-white" label-color="grey-7" />
      <q-input v-model="password" type="password" label="Password" input-class="text-white" label-color="grey-7" />
      <q-input
        v-model="passwordConfirm"
        type="password"
        label="Confirm Password"
        input-class="text-white"
        label-color="grey-7"
      />
      <q-btn label="Register" color="primary" @click="doRegister" />
      <q-btn
        label="Back to Login"
        flat
        class="q-mt-xl"
        @click="$router.push({ name: 'Login' })"
      />
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
const passwordConfirm = ref("");
const $q = useQuasar();
const router = useRouter();

const doRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    $q.notify({ type: "negative", message: "Passwords do not match" });
    return;
  }
  try {
    await store.register(username.value, password.value);
    $q.notify({ type: "positive", message: "Registration successful" });
    router.push({ name: "Login" });
  } catch (err) {
    const msg = err.response?.data?.detail || err.message;
    $q.notify({ type: "negative", message: msg });
  }
};
</script>
