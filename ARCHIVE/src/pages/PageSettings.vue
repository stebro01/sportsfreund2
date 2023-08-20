<template>
  <q-page padding>
        <div class="row q-pa-sm">
          <div class="col-12 q-mt-sm q-mb-lg">
            <span class="text-h4"> {{textTemplate[26]}} </span>
          </div>
          <div class="col-12">
            <ul>
              <li>
                <q-toggle :label="getSettings({name: 'timer', key: 'label'})" v-model="$store.state.settings[0].value">
                </q-toggle>
              </li>
              <li class="q-ml-lg" v-show="$store.state.settings[0].value">
                <q-toggle :label="textTemplate[54]" v-model="$store.state.settings[0].playSound">
                </q-toggle>
              </li>
              <li>
                <q-toggle :label="getSettings({name: 'edit', key: 'label'})" v-model="$store.state.settings[1].value">
                </q-toggle>
              </li>
              <li>
                <q-toggle :label="getSettings({name: 'auto_save', key: 'label'})" v-model="$store.state.settings[3].value">
                </q-toggle>
              </li>
              <li>
                <q-toggle :label="getSettings({name: 'edit_db', key: 'label'})" v-model="$store.state.settings[2].value">
                </q-toggle>
              </li>
            </ul>

          </div>
        </div>

          <div class="doc-container">
            <hr>
            <div class="row text-center">
              <div class="col-12 text-h6 q-ma-md">{{ textTemplate[36] }}</div>

              <div class="col-12 col-md q-mb-sm">
                <q-btn class="btn-set" @click="saveSettings">{{textTemplate[33]}}</q-btn>
              </div>
              <div class="col-12 col-md q-mb-sm">
                <q-btn class="btn-set" @click="loadSettings">{{textTemplate[34]}}</q-btn>
              </div>
              <div class="col-12 col-md q-mb-sm">
                <q-btn class="btn-set" @click="confirmClear=true">{{textTemplate[35]}}</q-btn>
              </div>
            </div>
          </div>

          <div class="doc-container q-mt-lg" v-show="$store.state.settings[2].value">
            <hr>
            <div class="row text-center">
              <div class="col-12 text-h6 q-ma-md">{{ textTemplate[32] }}</div>

              <div class="col-12 col-md q-mb-sm">
                <q-btn class="btn-set q-mb-sm" @click="saveDB">SAVE TO DB</q-btn>
              </div>
              <div class="col-12 col-md q-mb-sm">
                <q-btn class="btn-set q-mb-sm" @click="logDB">LOG DB</q-btn>
              </div>
              <div class="col-12 col-md q-mb-sm">
                <q-btn class="btn-set q-mb-sm" @click="clearDB">CLEAR DB</q-btn>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md">
                  <span class="text-subtitle1">settings: </span>
                  <span class="text-caption">{{ $store.state.settings }}</span>
              </div>
              <div class="col-12 col-md">
                <span class="text-subtitle1">workouts: </span>
                <span class="text-caption">{{ $store.state.workouts }}</span>
              </div>
            </div>
          </div>

          <!-- DIALOGS -->
          <q-dialog v-model="confirmClear" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <span class="q-ml-sm">{{textTemplate[52]}}</span>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat :label="textTemplate[10]" color="primary" v-close-popup />
                <q-btn flat :label="textTemplate[14]" color="primary" @click="clearSettings" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

  </q-page>
</template>

<script>
import textTemplate from '../helper/textTemplate'
import * as settings from '../helper/settings'
export default {
  props: ['workout', 'ind', 'editWorkout'],
  data () {
    return {
      textTemplate: textTemplate,
      confirmClear: false
    }
  },
  methods: {
    saveSettings () {
      this.$store.dispatch('clearDBLocalSettings')
      this.$store.dispatch('saveDBLocal', { storage: 'settings', data: undefined })
    },
    clearSettings () {
      this.$store.dispatch('clearDBLocalSettings')
    },
    loadSettings () {
      this.$store.dispatch('loadDBLocal', { storage: 'settings' })
    },
    logDB () {
      this.$store.dispatch('showDBLocal', { storage: 'settings' })
      this.$store.dispatch('showDBLocal', { storage: 'workouts' })
    },
    saveDB () {
      this.$store.dispatch('saveDBLocal', { storage: 'workouts', data: { workout: 'klimmzuege', repeat: 100 } })
    },

    clearDB () {
      this.$store.dispatch('clearDBLocal')
    },
    getSettings (value) {
      return settings.get(value)
    }

  },
  computed: {
  }
}
</script>

<style lang="stylus">
  ul {
    list-style-type: none;
  }

  .btn-set {
    width: 170px;
  }
</style>
