import { defineStore } from 'pinia'

const templatePresets = [
  { label: 'letztes Workout laden', data: undefined },
  { label: 'Tabata', data: { action: { value: 30 }, break: { value: 5 }, exercises: { value: 4 }, rounds: { value: 5 }, round_break: { value: 15 } } },
  { label: 'Ohio', data: { action: { value: 30 }, break: { value: 5 }, exercises: { value: 3 }, rounds: { value: 3 }, round_break: { value: 5 } } }
]

const defaultPreset = {
  action: { value: 5, unit: 's' },
  break: { value: 2, unit: 's' },
  exercises: { value: 2, unit: 'x' },
  rounds: { value: 2, unit: 'x' },
  round_break: { value: 10, unit: 's' },
  label: 'Default'
}

export const useAppStore = defineStore('app', {
  state: () => {
    let lastPreset = localStorage.getItem('last_preset')
    if (lastPreset !== null) lastPreset = JSON.parse(lastPreset)
    let presets = localStorage.getItem('presets')
    if (presets !== null) presets = JSON.parse(presets)
    return {
      ENV: {
        APP_URL: 'http://localhost:3000',
        APP_VERSION: 'v202308',
        APP_NAME: 'Sportfreunde 2.0'
      },
      SETTINGS: {
        audio_playback: true,
        quick_timer_start_value: 20 // in seconds
      },
      LAST_PRESET: lastPreset || undefined,
      PRESETS: presets || templatePresets,
      essentialLinks: [
        { titel: 'Home', caption: 'zurück', icon: 'home', route: 'Index' },
        { seperator: true },
        { titel: 'Über', caption: 'about', icon: 'info', route: 'About' },
        { titel: 'ChangeLog', caption: 'changelog', icon: 'info', route: 'ChangeLog' },
        { titel: 'Impressum', caption: '', icon: 'gavel', route: 'Impressum' }
      ]
    }
  },
  getters: {
    essentialLinks: state => state.essentialLinks,
    env: state => state.ENV,
    settings: state => state.SETTINGS,
    lastPreset: state => state.LAST_PRESET || defaultPreset,
    presets: state => state.PRESETS
  },
  actions: {
    log(payload) {
      console.log(payload)
    },
    setSettingsAudioPlayback(payload) {
      this.SETTINGS.audio_playback = payload
    },
    setSettingsQuickTimerStartValue(payload) {
      this.SETTINGS.quick_timer_start_value = payload
    },
    setLastPreset(payload) {
      this.log({ message: 'SET_LAST_PRESET' })
      window.localStorage.setItem('last_preset', JSON.stringify(payload))
      this.LAST_PRESET = payload
    },
    addPreset(payload) {
      this.log({ message: 'ADD_PRESET' })
      this.PRESETS.push(payload)
      window.localStorage.setItem('presets', JSON.stringify(this.PRESETS))
    },
    removePreset(label) {
      this.log({ message: 'REMOVE_PRESET' })
      this.PRESETS = this.PRESETS.filter(preset => preset.label !== label)
      window.localStorage.setItem('presets', JSON.stringify(this.PRESETS))
    }
  }
})
