<template>
  <q-btn class="my-main-btn" @click="$emit('clicked')" no-caps>
    <q-item dense class="fit">
      <q-item-section avatar><q-icon :name="icon"></q-icon></q-item-section>
      <q-item-section>
        {{ label }}
      </q-item-section>
    </q-item>
  </q-btn>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyItemBtn',
  props: ["label", "icon"]

})
</script>
