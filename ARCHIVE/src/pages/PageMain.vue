<template>
  <div class = "container">
    <q-splitter
      v-model="splitterModel"
      :style="splitterStyle"
      horizontal
      @input="changeSplitter"
    >

      <template v-slot:before>
        <PageWorkout />
      </template>

      <template v-slot:after >
        <div v-show="showTimer">
          <Timer />
        </div>
      </template>

    </q-splitter>
  </div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */

import PageWorkout from './PageWorkout'
import Timer from '../components/Timer'

export default {
  data () {
    return {
      splitterModel: 90,
      splitterStyle: 'height: 99vh'
    }
  },
  components: {
    PageWorkout,
    Timer
  },
  computed: {
    showTimer () {
      const val = this.$store.state.settings[0].value

      if (val) {
        this.splitterModel = this.$store.state.settings[0].size_on
      } else {
        this.splitterModel = this.$store.state.settings[0].size_off
      }

      return val
    }
  },
  methods: {
    changeSplitter (size) {
      const val = this.$store.state.settings[0].value

      if (val) {
        this.$store.state.settings[0].size_on = size
      }
    }
  }
}
</script>
