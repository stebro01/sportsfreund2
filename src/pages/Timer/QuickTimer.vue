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
        <q-btn v-if="!isActive" class="my-main-btn" @click="startTimer()">Start</q-btn>
        <!-- STOP -->
        <q-btn v-if="isActive" class="my-main-btn" @click="stopTimer()">Stop</q-btn>
      </div>

      <!-- CIRCLE -->
      <div class="col-7 row justify-center items-center">
        <q-knob show-value class="text-white q-ma-md timer-knob" v-model="TIMER_VALUE" size="180px" :thickness="0.2" color="green-4"
          :center-color="timer_finished ? 'green-4' : 'grey-6'" track-color="transparent" readonly="">
          <div>
            <div>{{ time - progress }}
              <q-popup-edit v-if="!isActive" v-model="time" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
              </q-popup-edit>
            </div>
            <div class="my-small-text">Sekunden</div>
          </div>
        </q-knob>

      </div>
      <div class="col-1">
        <div class="row justify-center q-gutter-md" v-if="!isActive">
          <q-btn class="my-decent-text" color="positive" @click="addTime(5)" round>+5</q-btn>
          <q-btn class="my-decent-text" color="positive" @click="addTime(1)" round>+1</q-btn>
          <q-btn class="my-decent-text" color="negative" @click="addTime(-1)" round>-1</q-btn>
          <q-btn class="my-decent-text" color="negative" @click="addTime(-5)" round>-5</q-btn>
        </div>
      </div>
      <div class="col-2">
        <div class="row justify-center q-gutter-sm" v-if="store.pinnedTimers.length">
          <q-chip
            v-for="t in store.pinnedTimers"
            :key="'p'+t"
            class="pinned-chip"
            clickable
            removable
            @click="selectTime(t)"
            @remove="unpinTimer(t)"
          >
            {{ t }}s
          </q-chip>
        </div>
        <div class="row justify-center q-gutter-sm" v-if="store.recentTimers.length">
          <q-chip v-for="t in store.recentTimers" :key="'r'+t" class="recent-chip" clickable @click="selectTime(t)">
            {{ t }}s
            <q-icon name="push_pin" size="xs" class="q-ml-xs" @click.stop="pinTimer(t)" />
          </q-chip>
        </div>
      </div>


    </div>

  </q-page>
</template>

<script>
import { useAppStore } from 'stores/appStore'
import playSound from 'src/tools/sound.js'
import useTimer from 'src/composables/useTimer'
export default {
  name: 'QuickTimer',
  components: {

  },
  setup () {
    const store = useAppStore()
    const { start: startInterval, stop: stopInterval, progress, isActive } = useTimer()
    return { store, startInterval, stopInterval, progress, isActive }
  },
  data() {
    return {
      time: this.store.settings.quick_timer_start_value,
      timer_finished: false
    }
  },
  mounted() {

  },

  computed: {
    TIMER_VALUE() {
      return this.progress / this.time * 100
    }
  },

  methods: {
    goBack() {
      this.stopInterval()
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
      playSound('gong', this.store.settings.audio_playback)
      this.timer_finished = false
      let timeLeft = this.time
      this.progress = 0
      this.startInterval(() => {
        timeLeft = timeLeft - 1
        if (timeLeft <= 0) {
          playSound('gong', this.store.settings.audio_playback)
          this.stopInterval()
          this.timer_finished = true
          this.store.setSettingsQuickTimerStartValue(this.time)
          this.store.addRecentTimer(this.time)
        }
      })

    },

    stopTimer() {
      this.stopInterval()
      this.timer_finished = false
    },
    selectTime(t) {
      this.time = t
      this.timer_finished = false
    },
    pinTimer(t) {
      this.store.pinTimer(t)
    },
    unpinTimer(t) {
      this.store.unpinTimer(t)
    }


    // ENDE
  }
}

</script>

<style scoped>
.timer-knob {
  box-shadow: 0 0 15px rgba(0, 255, 100, 0.6);
  border-radius: 50%;
}
.pinned-chip {
  background-color: #ffc107;
  color: #000;
  font-size: 1.1rem;
  padding: 4px 8px;
}
.recent-chip {
  background-color: #555;
  color: #fff;
}
</style>
