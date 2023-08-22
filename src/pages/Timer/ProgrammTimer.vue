<template>
  <q-page data-cy="page_about" class="full-height">
    <q-btn icon="close" size="lg" flat round class="absolute-top-right" @click="goBack()" />
    <q-btn :icon="!$store.getters.SETTINGS.audio_playback ? 'volume_off' : 'volume_up'" size="lg" flat round
      class="absolute-top-left"
      @click="$store.commit('SET_SETTINGS_AUDIO_PLAYBACK', !$store.getters.SETTINGS.audio_playback)" />
    <div class="column text-center" style="height: 100vh; width: 100vw">
      <div class="col-1">Program</div>
      <!-- TIMER ELEMENT -->
      <!-- BTN -->
      <div class="col-2">
        <!-- START -->
        <q-btn v-if="!interval" class="my-main-btn" @click="startTimer()">Start</q-btn>
        <!-- STOP -->
        <q-btn v-if="interval" class="my-main-btn" @click="stopTimer()">Stop</q-btn>
      </div>

      <!-- DURATION -->
      <div class="col-1">
        <q-chip class="bg-orange-5"><span class="text-caption q-mr-sm">Total-Dauer:</span> <span class="text-h6">{{
          formatTime(DURATION_CALC)
        }}</span></q-chip>
      </div>

      <!-- OPTIONS -->
      <div class="col row justify-center">
        <!-- STEUER ELEMENTE -->
        <q-list class="" style="max-width: 400px; min-width: 350px">
          <!-- SELECTION / PREVIOUS -->
          <q-item clickable v-ripple class="q-ma-sm">
            <q-item-section avatar><q-icon name="today" /></q-item-section>
            <q-item-section>
              <q-btn-dropdown flat no-caps :label="PRESET_LABEL">
                <q-list class="bg-dark">
                  <q-item clickable v-ripple v-for="preset in PRESETS" :key="preset.label + 'presetlist'"
                    @click="selectPreset(preset)">
                    <q-item-section>{{ preset.label }}</q-item-section>
                    <q-item-section v-if="preset.data" side> <q-icon name="av_timer" />{{
                      formatTime(calcDuration(preset.data)) }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-section>
          </q-item>

          <!-- Action -->
          <q-item clickable v-ripple class="my-action-item q-ma-sm">
            <q-item-section avatar><q-icon name="play_circle" /></q-item-section>
            <q-item-section class="text-white">Action</q-item-section>
            <q-item-section side class="text-positive">{{ formatTime(localData.action.value) }}</q-item-section>
            <q-popup-proxy>
              <q-card class="my-popup-card text-center shadow-1">
                <q-btn icon="clear" flat round class="absolute-top-right z-top" v-close-popup />
                <q-card-section>Action anpassen</q-card-section>
                <q-card-section>
                  <q-slider v-model="localData.action.value" color="white" label label-text-color="dark" thumb-size="50px"
                    :step="1" :min="5" :max="120" />
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-item>

          <!-- Pause -->
          <q-item clickable v-ripple class="my-pause-item q-ma-sm">
            <q-item-section avatar><q-icon name="pause_circle" /></q-item-section>
            <q-item-section class="text-white">Pause</q-item-section>
            <q-item-section side class="text-red">{{ formatTime(localData.break.value) }}</q-item-section>
            <q-popup-proxy>
              <q-card class="my-popup-card text-center shadow-1">
                <q-btn icon="clear" flat round class="absolute-top-right z-top" v-close-popup />
                <q-card-section>Pause anpassen</q-card-section>
                <q-card-section>
                  <q-slider v-model="localData.break.value" color="white" label label-text-color="dark" thumb-size="50px"
                    :step="1" :min="0" :max="60" />
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-item>

          <!-- Excercises -->
          <q-item clickable v-ripple class="q-ma-sm bg-grey-10">
            <q-item-section avatar><q-icon name="fitness_center" /></q-item-section>
            <q-item-section>Übungen</q-item-section>
            <q-item-section side>{{ localData.exercises.value }} {{ localData.exercises.unit }} </q-item-section>
            <q-popup-proxy>
              <q-card class="my-popup-card text-center shadow-1">
                <q-btn icon="clear" flat round class="absolute-top-right z-top" v-close-popup />
                <q-card-section>Übungen anpassen</q-card-section>
                <q-card-section>
                  <q-slider v-model="localData.exercises.value" label label-text-color="dark" color="white"
                    thumb-size="50px" :step="1" :min="1" :max="50" />
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-item>

          <!-- Repetitions -->
          <q-item clickable v-ripple class="q-ma-sm bg-grey-10">
            <q-item-section avatar><q-icon name="restart_alt" /></q-item-section>
            <q-item-section>Wiederholungen</q-item-section>
            <q-item-section side>{{ localData.rounds.value }} {{ localData.rounds.unit }}</q-item-section>
            <q-popup-proxy>
              <q-card class="my-popup-card text-center shadow-1">
                <q-btn icon="clear" flat round class="absolute-top-right z-top" v-close-popup />
                <q-card-section>Wiederholungen anpassen</q-card-section>
                <q-card-section>
                  <q-slider v-model="localData.rounds.value" label label-text-color="dark" color="white" thumb-size="50px"
                    :step="1" :min="1" :max="50" />
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-item>

          <!-- BREAKS -->
          <q-item clickable v-ripple class="q-ma-sm my-pause-item">
            <q-item-section avatar><q-icon name="restore" /></q-item-section>
            <q-item-section class="text-white">Rundenpause</q-item-section>
            <q-item-section side class="text-red">{{ formatTime(localData.round_break.value) }}</q-item-section>
            <q-popup-proxy>
              <q-card class="my-popup-card text-center shadow-1">
                <q-btn icon="clear" flat round class="absolute-top-right z-top" v-close-popup />
                <q-card-section>Rundenpause anpassen</q-card-section>
                <q-card-section>
                  <q-slider v-model="localData.round_break.value" label label-text-color="dark" color="white"
                    thumb-size="50px" :step="1" :min="0" :max="60" />
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-item>


        </q-list>


      </div>


      <!-- ENDE COL -->
    </div>

  </q-page>
</template>

<script>
export default {
  name: 'ProgrammTimer',
  components: {

  },
  data() {
    return {
      interval: undefined,
      timer_finished: false,
      localData: {
        action: { value: 40, unit: 's' },
        break: { value: 10, unit: 's' },
        exercises: { value: 10, unit: 'x' },
        rounds: { value: 4, unit: 'x' },
        round_break: { value: 20, unit: 's' },
        label: 'Tabata'
      },
      value: 0,
      time: 0
    }
  },
  mounted() {

  },

  computed: {
    TIMER_VALUE() {
      return this.value
    },

    DURATION_CALC() {
      return this.calcDuration(this.localData)
    },

    PRESETS() {
      return [
        { label: 'letztes Workout laden', data: undefined },
        { label: 'Tabata', data: { action: { value: 30 }, break: { value: 5 }, exercises: { value: 4 }, rounds: { value: 5 }, round_break: { value: 15 } } },
        { label: 'Ohio', data: { action: { value: 30 }, break: { value: 5 }, exercises: { value: 3 }, rounds: { value: 3 }, round_break: { value: 5 } } },
      ]
    },

    PRESET_LABEL() {
      return this.localData.label
    },

  },

  methods: {
    goBack() {
      if (this.interval) clearInterval(this.interval)
      this.$router.go(-1)
    },

    // input is in seconds, output: mm:ss
    formatTime(seconds) {
      const date = new Date(null)
      date.setSeconds(seconds)
      return date.toISOString().substr(14, 5)
    },

    calcDuration(data) {
      const { action, break: _break, exercises, rounds, round_break } = data
      const total = (action.value + _break.value) * exercises.value * rounds.value + round_break.value * rounds.value
      return total
    },

    selectPreset(preset) {
      if (preset.data === undefined) {
        // load last workout
        // this.localData = this.$store.getters.GET_LAST_WORKOUT
        return
      } else {
        this.localData.action.value = preset.data.action.value
        this.localData.break.value = preset.data.break.value
        this.localData.exercises.value = preset.data.exercises.value
        this.localData.rounds.value = preset.data.rounds.value
        this.localData.round_break.value = preset.data.round_break.value
        this.localData.label = preset.label

      }

    },

    // TIMER
    startTimer() {

    },

    stopTimer() {

    },



    // ENDE
  }
}

</script>
