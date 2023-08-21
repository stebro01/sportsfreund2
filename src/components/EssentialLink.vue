<template>
  <q-item v-if="el.seperator !== true" clickable @click="$router.push({ name: el.route })"
    :disable="$route.name === el.route">
    <q-item-section v-if="el.icon" avatar>
      <q-icon :name="el.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ el.titel }}</q-item-label>
      <q-item-label caption class="my-decent-text">{{ el.caption }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-separator v-else class="q-ma-lg my-decent-bg" style="opacity: 0.5" />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: ["el"]

})
</script>
