<template>
  <q-page padding>
    <div class="doc-container q-pa-sm">
      <div class="row">
        <div class="col-12 q-mt-sm q-mb-lg">
          <span class="text-h4"> {{textTemplate[0]}} </span>
        </div>
      </div>

      <div class="row q-ma-xl justify-center">
        <div class="col-10">
          <q-btn align="around" class="full-width" icon='favorite' size='xl' @click="$router.push('/workouts')">gleich loslegen</q-btn>
        </div>
      </div>

      <div class="row q-ma-xl justify-center">
        <div class="col-8">
          <div class="text-h6">TODO</div>
          <ul>
            <li>FIREBASE SYNC</li>
            <li>STATS</li>
            <li>LAYOUT</li>
            <li>ABOUT</li>
          </ul>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import textTemplate from '../helper/textTemplate'
export default {
  data () {
    return {
      textTemplate: textTemplate
    }
  },
  methods: {

  }
}
</script>

<style lang="stylus">

</style>
