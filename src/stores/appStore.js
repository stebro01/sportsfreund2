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
    let lastPreset
    try {
      const rawLastPreset = localStorage.getItem('last_preset')
      if (rawLastPreset !== null) lastPreset = JSON.parse(rawLastPreset)
    } catch (e) {
      lastPreset = undefined
    }

    let presets
    try {
      const rawPresets = localStorage.getItem('presets')
      if (rawPresets !== null) presets = JSON.parse(rawPresets)
    } catch (e) {
      presets = null
    }

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
      PROGRAM_STEPS: [],
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
    presets: state => state.PRESETS,
    programSteps: state => state.PROGRAM_STEPS
  },
    actions: {
      setSettingsAudioPlayback(payload) {
        this.SETTINGS.audio_playback = payload
      },
    setSettingsQuickTimerStartValue(payload) {
      this.SETTINGS.quick_timer_start_value = payload
    },
      setLastPreset(payload) {
        console.log({ message: 'SET_LAST_PRESET' })
        window.localStorage.setItem('last_preset', JSON.stringify(payload))
        this.LAST_PRESET = payload
      },
      addPreset(payload) {
        console.log({ message: 'ADD_PRESET' })
        this.PRESETS.push(payload)
        window.localStorage.setItem('presets', JSON.stringify(this.PRESETS))
      },
      removePreset(label) {
        console.log({ message: 'REMOVE_PRESET' })
        this.PRESETS = this.PRESETS.filter(preset => preset.label !== label)
        window.localStorage.setItem('presets', JSON.stringify(this.PRESETS))
      },
      addProgramStep(step) {
        this.PROGRAM_STEPS.push(step)
      },
      removeProgramStep(index) {
        this.PROGRAM_STEPS.splice(index, 1)
      },
      moveProgramStep(from, to) {
        const item = this.PROGRAM_STEPS.splice(from, 1)[0]
        this.PROGRAM_STEPS.splice(to, 0, item)
      },
      updateProgramStep(index, partial) {
        this.PROGRAM_STEPS[index] = {
          ...this.PROGRAM_STEPS[index],
          ...partial
        }
      }
  }
})
