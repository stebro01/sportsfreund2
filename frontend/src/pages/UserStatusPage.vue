<template>
  <q-page class="column items-center justify-center">
    <div class="text-h5 q-mb-md">User Status</div>
    <div class="column q-gutter-sm" style="width: 300px">
      <q-input v-model="uid" label="UID" input-class="text-white" label-color="grey-7" readonly/>
      <q-input v-model="username" label="Username" input-class="text-white" label-color="grey-7" readonly />
      <q-input v-model.number="age" type="number" label="Age" input-class="text-white" label-color="grey-7" />
      <q-input v-model="password" type="password" label="New Password" input-class="text-white" label-color="grey-7" />
      <q-btn label="Save" color="primary" @click="save" />
      <q-btn label="Delete Account" color="negative" @click="remove" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/authStore";
import { useApiStore } from "stores/apiStore";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();
const api = useApiStore();
api.init();

const $q = useQuasar();

const username = ref(auth.username);
const age = ref(0);
const password = ref("");
const uid = ref(auth.uid);

onMounted(() => {
  auth.autoLogin();

  // get user data
  getUser();
});

const getUser = async () => {
  const response = await api.get(`/user/${auth.uid}`);
  if (response.status === 200) {
    const user = response.data;
    username.value = user.username;
    age.value = user.age;

  }
};

const save = async () => {
  const data = { username: username.value, age: age.value };
  if (password.value) data.password = password.value;
  try {
    await api.put(`/user/${auth.uid}`, data);
    auth.username = username.value;
    $q.notify({ type: "positive", message: "Updated" });
  } catch (err) {
    const msg = err.response?.data?.detail || err.message;
    $q.notify({ type: "negative", message: msg });
  }
};

const remove = async () => {
  if (!confirm("Are you sure you want to delete your account?")) return;
  try {
    await api.delete(`/user/${auth.uid}`);
    auth.uid = null;
    auth.username = "";
    localStorage.removeItem("uid");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    $q.notify({ type: "positive", message: "Account deleted" });
    router.push({name: 'Login'});
  } catch (err) {
    const msg = err.response?.data?.detail || err.message;
    $q.notify({ type: "negative", message: msg });
  }
};
</script>
