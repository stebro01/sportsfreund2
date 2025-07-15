<template>
  <q-page
    data-cy="page_about"
    class="page-size no-pointer-events non-selectable"
  >
    <div class="column items-center q-px-xl">
      <div class="col">
        <p v-html="missionTxt" class="standard_text"></p>
      </div>
      <div class="col"></div>
    </div>
  </q-page>
</template>

<script>
import showdown from "showdown";
import MD_TEXT from "../../ABOUT.md?raw";
import { useAppStore } from "stores/appStore";

export default {
  name: "AboutPage",
  components: {},
  setup() {
    const store = useAppStore();
    return { store };
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    missionTxt() {
      var converter = new showdown.Converter(),
        html = converter.makeHtml(MD_TEXT);
      return html;
    },
  },
};
</script>
