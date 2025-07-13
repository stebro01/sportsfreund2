<template>
  <q-page data-cy="page_about" class="full-height">
    <q-btn icon="close" size="lg" flat round class="absolute-top-right" @click="goBack()" />
    <q-btn :icon="!store.settings.audio_playback ? 'volume_off' : 'volume_up'" size="lg" flat round
      class="absolute-top-left"
      @click="store.setSettingsAudioPlayback(!store.settings.audio_playback)" />
    <div class="column text-center" style="height: 100vh; width: 100vw">
      <div class="col-1">Program</div>
      <!-- TIMER ELEMENT -->
      <!-- BTN -->
      <div class="col-2">
        <MY_ITEM_BTN v-if="!interval && timer_halted === false" :label="'START'" :icon="'play_arrow'"
          @clicked="startTimer()" />
        <MY_ITEM_BTN v-if="!interval && timer_halted === true" :label="'ABBRECHEN'" :icon="'close'"
          @clicked="clearTimer()" />
        <MY_ITEM_BTN v-if="interval && !timer_finished" :label="'STOP'" :icon="'stop'" @clicked="stopTimer()" />
        <MY_ITEM_BTN v-if="interval && timer_finished" :label="'ZURÜCK'" :icon="'arrow_back'" @clicked="clearTimer()" />
      </div>

      <!-- DURATION -->
      <div class="col-1">
        <q-chip class="bg-orange-5">
          <span class="text-caption q-mr-sm" v-if="!TIME_DATA">Total:</span>
          <span class="text-caption q-mr-sm" v-else>Rest:</span>
          <span class="text-h6">{{ formatTime(DURATION_CALC) }}</span>
        </q-chip>
      </div>

      <!-- OPTIONS -->
      <div v-if="interval === undefined && timer_halted === false" class="col row justify-center">
        <!-- STEUER ELEMENTE -->
        <q-list class="" style="max-width: 400px; min-width: 350px">
          <!-- SELECTION / PREVIOUS -->
          <q-item clickable v-ripple class="q-ma-sm">
            <q-item-section avatar><q-icon name="today" /></q-item-section>
            <q-item-section>
              <q-btn-dropdown flat no-caps :label="PRESET_LABEL">
                <q-list class="bg-dark">
                  <q-item clickable v-close-popup v-ripple v-for="preset in PRESETS" :key="preset.label + 'presetlist'"
                    @click="selectPreset(preset)">
                    <q-item-section>{{ preset.label }}</q-item-section>
                    <q-item-section v-if="preset.data" side> <q-icon name="av_timer" />{{
                      formatTime(calcDuration(preset.data)) }}</q-item-section>
                  </q-item>
                  <q-item avatar v-close-popup="">
                    <q-btn flat size="md" icon="add" @click="addPreset()"></q-btn>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-section>
            <q-item-section side v-if="localData.label === label_new_preset"><q-btn flat icon="save"
                @click="saveNewPreset()" color="white"></q-btn></q-item-section>
            <q-item-section side v-else-if="localData.label !== label_new_preset && localData.label !== 'Default'"><q-btn
                flat icon="delete" @click="removePreset(this.localData.label)" color="grey-5"></q-btn></q-item-section>
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

      <!-- TIMER -->
      <div v-else class="col-2">
        <q-knob show-value class="text-white q-ma-md" v-model="TIMER_PERCENTAGE" size="150px" :thickness="0.2"
          color="grey-3" :center-color="TIMER_COLOR" track-color="transparent" readonly="">

          <div v-if="timer_finished === true">
            <span style="font-size: 3em;">🥇</span>
          </div>
          <div v-else-if="TIME_DATA && TIME_DATA[TIME_IND]">

            <div v-if="!timer_halted">
              <div>
                {{ formatTime(TIMER_VALUE) }}
                <q-tooltip>{{ TIME_DATA[TIME_IND] }}</q-tooltip>
              </div>
              <div class="text-caption">{{ TIMER_TYPE }}</div>
            </div>
            <div v-else class="cursor-pointer" @click="proceedTimer()">
              <div class="text-caption">Unterbrochen</div>
            </div>
          </div>


        </q-knob>

        <div v-if="TIME_DATA && TIME_DATA[TIME_IND] && !timer_halted">
          <q-chip>Übung: {{ TIME_DATA[TIME_IND].ind + 1 }} / {{ localData.exercises.value }}</q-chip>
          <q-chip>Runde: {{ TIME_DATA[TIME_IND].round_ind + 1 }} / {{ localData.rounds.value }}</q-chip>
        </div>
        <div v-else-if="TIME_DATA && TIME_DATA[TIME_IND] && timer_halted">
          <MY_ITEM_BTN :label="'WEITER'" :icon="'play_arrow'" @clicked="proceedTimer()" />
        </div>
        <div v-else-if="timer_finished" class="text-orange-4">
          <div>
            {{ ZITAT.text_de }}
          </div>
          <div class="text-caption q-mt-md">
            {{ ZITAT.author }}
          </div>
        </div>

      </div>

      <!-- ENDE COL -->
    </div>

  </q-page>
</template>

<script>
import MY_ITEM_BTN from 'components/MyItemBtn.vue'
import getRandomCitation from 'src/tools/citate.js'
import { useAppStore } from 'stores/appStore'
import createSoundMap from 'src/tools/soundMap.js'
import beepbeepbeep_1s from 'assets/sounds/beepbeepbeep_1s.wav'
import beep_1s from 'assets/sounds/beep_1s.wav'
import tada from 'assets/sounds/tada.wav'

const soundMap = createSoundMap({ beepbeepbeep_1s, beep_1s, tada })

export default {
  name: 'ProgrammTimer',
  components: {
    MY_ITEM_BTN
  },
  setup () {
    const store = useAppStore()
    return { store }
  },
  data() {
    return {
      interval: undefined,
      timer_finished: false,
      timer_halted: false,
      localData: JSON.parse(JSON.stringify(this.store.lastPreset)),
      value: 0,
      TIME_DATA: undefined,
      TIME_IND: undefined,
      label_new_preset: 'Neues Programm'

    }
  },
  mounted() {

  },

  computed: {
    TIMER_VALUE() {
      if (!this.TIME_DATA) return 0
      // return the value of the current timer as difference from value and the current time
      const currentTimer = this.TIME_DATA[this.TIME_IND]
      return currentTimer.value - this.value
    },

    TIMER_PERCENTAGE() {
      if (!this.TIME_DATA) return 0
      // return the value of the current timer as difference from value and the current time
      const currentTimer = this.TIME_DATA[this.TIME_IND]
      if (!currentTimer) return 0
      return this.value / currentTimer.value * 100
    },

    TIMER_TYPE() {
      // return a string matching the value of the current timer
      if (!this.TIME_DATA) return ''
      const currentTimer = this.TIME_DATA[this.TIME_IND]
      if (!currentTimer) return ''
      switch (currentTimer.type) {
        case 'action':
          return 'Action'
        case 'break':
          return 'Pause'
        case 'round_break':
          return 'Rundenpause'
        default:
          return ''
      }
    },

    TIMER_COLOR() {
      // create a color string matching the value of the current timer
      if (!this.TIME_DATA) return ''
      const currentTimer = this.TIME_DATA[this.TIME_IND]
      if (this.timer_halted) return 'grey-7'
      if (this.timer_finished) return 'dark'
      if (!currentTimer) return ''
      switch (currentTimer.type) {
        case 'action':
          return 'green-4'
        case 'break':
          return 'red-4'
        case 'round_break':
          return 'grey-6'
        default:
          return ''
      }
    },

    DURATION_CALC() {
      if (this.TIME_DATA) return this.calcDuration(this.TIME_DATA)
      else return this.calcDuration(this.localData)

    },

    PRESETS() {
      return this.store.presets
    },

    PRESET_LABEL() {
      return this.localData.label
    },

    ZITAT() {
      return getRandomCitation()
    }

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
      var total = 0 // in seconds
      if (!Array.isArray(data)) {
        const { action, break: _break, exercises, rounds, round_break } = data
        const action_time = (action.value + 1) * exercises.value * rounds.value
        const break_time = (_break.value + 1) * (exercises.value - 1) * rounds.value
        const round_break_time = (round_break.value + 1) * (rounds.value - 1)
        var total = action_time + break_time + round_break_time
      } else {
        data.forEach(time => {
          if (time._check === false) total += time.value + 1
        })
        total -= this.value
      }

      return total
    },

    addPreset() {
      this.localData = JSON.parse(JSON.stringify(this.store.lastPreset))
      this.localData.label = this.label_new_preset
    },

    removePreset(label) {
      //ask if really delete
      this.$q.dialog({
        title: 'Programm löschen',
        message: `Soll das Programm "${label}" wirklich gelöscht werden?`,
        cancel: true,
        persistent: true,
        dark: true
      }).onOk(() => {
        // remove preset
        this.store.removePreset(label)
        this.localData.label = 'Letztes Programm'
      })

    },

    selectPreset(preset) {
      if (preset.data === undefined) {
        // load last workout
        this.localData = JSON.parse(JSON.stringify(this.store.lastPreset))
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

    saveNewPreset() {
      //dialog with prompt of new name
      this.$q.dialog({
        title: 'Name des Programms',
        prompt: {
          model: this.label_new_preset,
          type: 'text'
        },
        cancel: true,
        persistent: true,
        dark: true
      }).onOk(data => {
        // save preset
        // check if name already exists
        const preset_exists = this.store.presets.find(preset => preset.label === data)
        if (data === this.label_new_preset || preset_exists) {
          return this.$q.notify({
            message: 'Bitte einen anderen Namen eingeben',
            color: 'red-5',
            textColor: 'white',
            icon: 'warning'
          })
        } //else
        this.localData.label = data
        const new_preset =
        {
          label: data,
          data: {
            action: {
              value: this.localData.action.value
            },
            break: {
              value: this.localData.break.value
            },
            exercises: {
              value: this.localData.exercises.value
            },
            rounds: {
              value: this.localData.rounds.value
            },
            round_break: {
              value: this.localData.round_break.value,
            }
          }
        }
        this.store.addPreset(new_preset)


      })


    },

    // TIMER
    async startTimer() {
      this.timer_finished = false
      this.timer_halted = false
      this.TIME_DATA = this._prepareTimer() // prepare an array with the times
      this.interval = true
      // COUNT DOWN 1s
      this.playSound('beepbeepbeep_1s')
      await this.delay(1500)

      this.store.setLastPreset(JSON.parse(JSON.stringify(this.localData)))

      // start timer
      this.nextTimer()

    },

    // go through the times array and set the timer, set times[X]._check to true if finished
    nextTimer(VALUE) {
      //determine next timer, where _check is false
      if (this.TIME_DATA === undefined) return
      // get the indes of the next timer
      this.TIME_IND = this.TIME_DATA.findIndex(time => time._check === false)
      // if no timer is left, stop
      if (this.TIME_IND === -1) {
        this.timer_finished = true
        this.value = 0
        this.playSound('tada')
        return
      } // else

      const nextTimer = this.TIME_DATA[this.TIME_IND]

      this.value = VALUE || 0
      // now start the intervall with ticks of 1s
      this.interval = setInterval(() => {
        // check if timer is finished
        if (this.value + 1 === nextTimer.value) this.playSound('beep_1s')
        if (this.value >= nextTimer.value) {

          // set _check to true
          nextTimer._check = true
          // stop timer
          clearInterval(this.interval)
          // start next timer
          this.nextTimer()
        } else {
          // increase value
          this.value++
        }
      }, 1000)
    },

    proceedTimer() {
      this.timer_halted = false
      this.nextTimer(this.value)
    },

    _prepareTimer() {
      //prepare an array with the times
      const times = []
      for (let round_i = 0; round_i < this.localData.rounds.value; round_i++) {
        for (let i = 0; i < this.localData.exercises.value; i++) {
          times.push({ type: 'action', value: this.localData.action.value, ind: i, round_ind: round_i, _check: false })
          times.push({ type: 'break', value: this.localData.break.value, ind: i, round_ind: round_i, _check: false })
        }
        if (round_i < this.localData.rounds.value - 1) {
          times.pop() // remove last element, because it is a break
          times.push({ type: 'round_break', value: this.localData.round_break.value, ind: 0, round_ind: round_i, _check: false })
        }
      }
      // remove last element, because it is a break
      times.pop()
      return times
    },

    stopTimer() {
      // stopp the timer / intervall
      clearInterval(this.interval)
      this.interval = undefined
      this.timer_finished = false
      this.timer_halted = true
    },

    clearTimer() {
      // clear the timer
      this.stopTimer()
      this.TIME_DATA = undefined
      this.value = 0
      this.timer_halted = false
      this.timer_finished = false
    },


    // SOUNDS
    playSound(item) {
      if (!this.store.settings.audio_playback) return
      if (this.$q.platform.is.cordova) {
        var path = cordova.file.applicationDirectory + "www/media/" + item + ".wav";

        var myMedia = new Media(path,
          function () {
            console.log("Audio Success");
          },
          function (err) {
            console.log("Audio Error: " + err.code);
          }
        );


        myMedia.play()
        return
      } else {
        var audio = new Audio(soundMap[item])
        audio.play({ playAudioWhenScreenIsLocked: true })
        return
      }
    },

    // SOME HELPER

    delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }


    // ENDE
  }
}

</script>
