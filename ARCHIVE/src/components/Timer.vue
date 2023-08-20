<template>
  <div class="container q-ml-md q-mr-md">
    <div class="row justify-center q-pa-sm" >
      <div :class="{'col-2': !Settings.show, 'col-10': Settings.show}">
          <div class="row">
              <q-btn class="btn_settings" icon="settings" @click="setSettings"/>
              <q-btn v-show="!Settings.show" class="btn_settings q-mt-lg" icon="replay" @click="resetTimer" />
          </div>
          <div v-show="Settings.show" class="row">
            <q-input v-model.number="Settings.actionTime" type="number" :label="textTemplate[23]" />
            <q-input v-model.number="Settings.breakTime" type="number" :label="textTemplate[24]" />
            <q-input v-model.number="Settings.repeat" type="number" :label="textTemplate[25]" />
            <br >
            <div v-show="$store.state.settings[0].playSound" class="q-mt-lg">
              <span class="text-caption text-weight-thin q-mt-lg">
                Lautstärke
              </span>
              <q-slider style="width: 20vw" v-model="$store.state.settings[0].playSoundVolume" label :min="0" :max="1" :step="0.2"/>
            </div>
          </div>
      </div>
      <div :class="{'col-8': !Settings.show, 'hidden': Settings.show}" class="flex-center flex" style="margin-top: -15px">
        <div v-if="!Timer.success">
            <q-knob
            disable
            :max="Timer.max"
            v-model="Timer.value"
            show-value
            size="100px"
            :thickness="0.3"
            color="warning"
            track-color="light"
            class="info q-ma-md"
            :class="Timer.mode"
            >
                <q-badge color="transparent" text-color="black">
                    <div class="container text-center">
                    <div class="q-pt-xs">
                        <span v-if="Timer.mode===Mode.break" class="text-h7">
                            {{textTemplate[19]}}
                            </span>
                            <span v-else class="text-h7">
                            {{textTemplate[20]}}
                            </span>
                            <br>
                            <span class="text-h6">{{ breakTimeLeft }}</span>
                            <span class="text-caption">s</span>
                    </div>
                    </div>
                </q-badge>
            </q-knob>
        </div>
        <div v-else>
            <q-btn color="info" class="q-mt-lg q-mb-lg" @click="resetTimer">
                <span class="text-h6">{{textTemplate[21]}}</span>
                <span class="text-caption">{{textTemplate[22]}}</span>
            </q-btn>
        </div>
        <q-linear-progress size="25px" :value="repeatValue" color="warning">
            <div class="absolute-full flex flex-center">
                <q-badge color="transparent" text-color="dark" :label="repeatLabel" />
            </div>
        </q-linear-progress>
      </div>
      <div class="col-2 text-right">
        <q-btn v-show="!Timer.active" class="btn_timer q-mb-md" icon="play_arrow" @click="startTimer" />
        <q-btn v-show="Timer.active" class="btn_timer q-mb-md" icon="stop" @click="stopTimer" />
      </div>
    </div>
    <!-- LITTLE WORKARROUND TO MAKE SOUND -->
    <audio :src="getSettings({'name': 'timer', 'key': 'playUrl'})" id="sound"></audio>
    <q-btn @click="playSound" class="hidden" label="click me"/>
  </div>
</template>

<script>
import LOG from '../helper/my_log'
import textTemplate from '../helper/textTemplate'
import * as settings from '../helper/settings'
export default {
  data () {
    return {
      textTemplate: textTemplate,
      Mode: {
        action: 'action_timer',
        break: 'break_timer'
      },
      Timer: {
        value: 0,
        max: 0,
        label: '',
        mode: 'action_timer',
        active: false,
        WORKER: undefined,
        success: false
      },
      Repeat: {
        value: 0,
        max: 0,
        label: textTemplate[25]
      },
      Settings: {
        actionTime: Number,
        breakTime: Number,
        repeat: Number,
        show: false
      },
      firstGong: false,
      needToSync: true
    }
  },
  created () {
    setTimeout(this.initTimer, 1000)
  },

  methods: {
    initTimer () {
      this.Settings.actionTime = this.$store.state.settings[0].timeOn
      this.Settings.breakTime = this.$store.state.settings[0].timeOff
      this.Settings.repeat = this.$store.state.settings[0].repeat
      this.resetTimer('init')
    },
    getSettings (payload) {
      return settings.get(payload)
    },
    startTimer () {
      this.Timer.active = true
      clearTimeout(this.Timer.WORKER)
      this.firstGong = true
      this.playSound()
      this.runTimer()
    },
    stopTimer () {
      this.Timer.active = false
      clearTimeout(this.Timer.WORKER)
      LOG('Timer: ' + this.active)
    },
    runTimer () {
      if (this.Timer.active) {
        this.incTimer(1)
        this.Timer.WORKER = setTimeout(this.runTimer, 1000)
      }
    },
    resetTimer (opt) {
      this.Timer.value = 0
      this.Repeat.value = 0
      this.Timer.mode = this.Mode.action
      this.Timer.max = this.Settings.actionTime
      this.Repeat.max = this.Settings.repeat
      this.Timer.success = false

      // update the STORE
      if (opt !== 'init') {
        this.$store.dispatch('updateTimerSettings', this.Settings)
        // LOG('udpate')
      }
    },
    incTimer (val) {
      if (this.Timer.success) {
        return true
      }
      this.Timer.value = this.Timer.value + val
      if (this.Timer.value === this.Timer.max) {
        this.playSound()
      }
      if (this.Timer.value > this.Timer.max) {
        this.Timer.value = 0
        if (this.Timer.mode === this.Mode.action) {
          this.Repeat.value++
          if (this.Repeat.value >= this.Repeat.max) {
            this.successTimer()
            return true
          } else {
            this.Timer.mode = this.Mode.break
            this.Timer.max = this.Settings.breakTime
          }
        } else {
          this.Timer.mode = this.Mode.action
          this.Timer.max = this.Settings.actionTime
        }
      }
    },

    successTimer () {
      this.stopTimer()
      this.Timer.success = true
      LOG('SUCCESS')
    },

    playSound () {
      if (this.$store.state.settings[0].playSound) {
        const mySound = document.getElementById('sound')
        if (this.firstGong) {
          this.firstGong = false
          mySound.volume = 0
          mySound.muted = true
          mySound.play()
        } else {
          mySound.volume = this.$store.state.settings[0].playSoundVolume
          mySound.muted = false
          mySound.play()
        }
      }
    },

    setSettings () {
      this.Settings.show = !this.Settings.show
      if (this.Settings.show === false) {
        this.resetTimer()
      }
    }
  },
  computed: {
    repeatLabel () {
      return this.Repeat.label + ': ' + this.Repeat.value + '/' + this.Repeat.max
    },
    repeatValue () {
      return this.Repeat.value / this.Repeat.max
    },
    breakTimeLeft () {
      return this.Timer.max - this.Timer.value
    }
  }
}

</script>

<style lang="stylus">
.btn_timer {
  width: 70px;
}

btn_settings {
  width: 40px;
}

.action_timer {
    color: $positive
}

.break_timer {
    color: $dark
}
</style>
