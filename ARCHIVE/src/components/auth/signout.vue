<template>
  <q-form>
    <h6>{{ textTemplate[50] }}</h6>
    <div class="q-gutter-md column">
    <q-btn class="q-mt-lg" @click="logout">{{ textTemplate[50] }}</q-btn>
    </div>
  </q-form>
</template>

<script>
import textTemplate from '../../helper/textTemplate'

export default {
  data () {
    return {
      textTemplate: textTemplate
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('userLogout')
    }
  }
}
</script>
