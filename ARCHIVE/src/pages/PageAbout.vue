<template>
  <q-page padding>
    <div class="doc-container q-pa-sm">
      <div class="row">
        <div class="col-12 q-mt-sm q-mb-lg">
          <span class="text-h4"> {{textTemplate[37]}} </span>
        </div>
      </div>

      <div class="row">
        <div class="col text-h6 q-ma-lg">
          {{textTemplate[0]}}
        </div>
        <div class="col text-caption">
          {{ textTemplate[1] }}
        </div>
      </div>

      <div class="row">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam earum debitis eaque, possimus explicabo non fugiat tempora eius sequi magni accusamus numquam. Quasi deserunt amet animi minima eaque. Voluptatibus, pariatur?
      </div>

      <br>

      <div class="row">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae maiores aut quo mollitia eos sed cumque reprehenderit iusto, saepe possimus, voluptates vero numquam esse alias quia dignissimos labore quibusdam culpa.
      </div>

      <div class="row">
        <div class="col-12 text-h6 q-ma-lg">
          Disclaimer
        </div>
        <div class="col-12">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, temporibus voluptatibus quae explicabo, quod id, dolores soluta repudiandae rerum autem fugiat! Voluptatibus aspernatur magni laudantium culpa saepe porro voluptates mollitia.
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
