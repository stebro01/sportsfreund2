<template>
  <q-page data-cy="page_about" class="full-height">
    <q-btn icon="close" size="lg" flat round class="absolute-top-right" @click="goBack()" />
    <q-btn :icon="!store.settings.audio_playback ? 'volume_off' : 'volume_up'" size="lg" flat round
      class="absolute-top-left"
      @click="store.setSettingsAudioPlayback(!store.settings.audio_playback)" />
    <div class="column text-center" style="height: 100vh; width: 100vw">
      <div class="col-1">QuickTimer</div>
      <!-- TIMER ELEMENT -->
      <!-- BTN -->
      <div class="col-2">
        <!-- START -->
        <q-btn v-if="!interval" class="my-main-btn" @click="startTimer()">Start</q-btn>
        <!-- STOP -->
        <q-btn v-if="interval" class="my-main-btn" @click="stopTimer()">Stop</q-btn>
      </div>

      <!-- CIRCLE -->
      <div class="col-7">
        <q-knob show-value class="text-white q-ma-md" v-model="TIMER_VALUE" size="150px" :thickness="0.2" color="green-4"
          :center-color="timer_finished ? 'green-4' : 'grey-6'" track-color="transparent" readonly="">
          <div>
            <div>{{ time - value }}
              <q-popup-edit v-if="interval === undefined" v-model="time" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
              </q-popup-edit>
            </div>
            <div class="my-small-text">Sekunden</div>
          </div>
        </q-knob>

      </div>
      <div class="col-1">
        <div class="row justify-center q-gutter-md" v-if="interval === undefined">
          <q-btn class="my-decent-text" color="positive" @click="addTime(5)" round>+5</q-btn>
          <q-btn class="my-decent-text" color="positive" @click="addTime(1)" round>+1</q-btn>
          <q-btn class="my-decent-text" color="negative" @click="addTime(-1)" round>-1</q-btn>
          <q-btn class="my-decent-text" color="negative" @click="addTime(-5)" round>-5</q-btn>
        </div>
      </div>


    </div>

  </q-page>
</template>

<script>
import { useAppStore } from 'stores/appStore'
export default {
  name: 'QuickTimer',
  components: {

  },
  setup () {
    const store = useAppStore()
    return { store }
  },
  data() {
    return {
      time: this.store.settings.quick_timer_start_value,
      value: 0,
      interval: undefined,
      timer_finished: false
    }
  },
  mounted() {

  },

  computed: {
    TIMER_VALUE: {
      get() {
        return this.value / this.time * 100
      },
      set(value) {
        this.value = value
      }
    }
  },

  methods: {
    goBack() {
      if (this.interval) clearInterval(this.interval)
      this.$router.go(-1)
    },

    addTime(value) {
      this.timer_finished = false
      this.time = this.time + value
      if (this.time <= 0) {
        this.time = this.store.settings.quick_timer_start_value
      }

    },

    // TIMER
    startTimer() {
      // value is the actual value of the timer
      // time is the time in seconds
      // timeLeft is the time left in seconds
      this.playSound('gong')
      this.timer_finished = false
      let timeLeft = this.time
      this.value = 0
      let value = 0
      this.interval = setInterval(() => {
        value = value + 1
        timeLeft = timeLeft - 1
        this.value = value
        if (timeLeft <= 0) {
          this.playSound('gong')
          clearInterval(this.interval)
          this.interval = undefined
          this.value = 0
          this.timer_finished = true
          this.store.setSettingsQuickTimerStartValue(this.time)
        }
      }, 1000)

    },

    stopTimer() {
      clearInterval(this.interval)
      this.interval = undefined
      this.value = 0
      this.timer_finished = false
    },

    // PLAY SOUND FILE
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
        var audio = new Audio(require(`assets/sounds/${item}.wav`))
        audio.play({ playAudioWhenScreenIsLocked: true })
        return
      }
    }


    // ENDE
  }
}

</script>
