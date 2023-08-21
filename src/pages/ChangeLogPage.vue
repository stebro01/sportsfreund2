<template>
  <q-page data-cy="page_about" class="page-size">

    <div class="column items-center q-px-xl">
      <div class="col">
        <p v-html="missionTxt" class=" standard_text"></p>
      </div>
      <div class="col">

      </div>
    </div>


  </q-page>
</template>

<script>
import showdown from "showdown"
import MD_TEXT from 'raw-loader!../../CHANGELOG.md'

export default {
  name: 'ChangeLogPage',
  components: {

  },
  data() {
    return {
    }
  },
  mounted() {

  },
  computed: {
    missionTxt() {
      var converter = new showdown.Converter(),
        html = converter.makeHtml(MD_TEXT);
      return html
    },
  },
}

</script>
