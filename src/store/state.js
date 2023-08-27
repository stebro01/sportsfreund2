
// load the presets from Storage
var last_preset = localStorage.getItem('last_preset')
if (last_preset !== null) last_preset = JSON.parse(last_preset)

const template_presets = [
  { label: 'letztes Workout laden', data: undefined },
  { label: 'Tabata', data: { action: { value: 30 }, break: { value: 5 }, exercises: { value: 4 }, rounds: { value: 5 }, round_break: { value: 15 } } },
  { label: 'Ohio', data: { action: { value: 30 }, break: { value: 5 }, exercises: { value: 3 }, rounds: { value: 3 }, round_break: { value: 5 } } },
]
var presets = localStorage.getItem('presets')
if (presets !== null) presets = JSON.parse(presets)
console.log(presets)

export default function () {
  return {
    ENV: {
      APP_URL: 'http://localhost:3000',
      APP_VERSION: 'v202308',
      APP_NAME: 'Sportfreunde 2.0',
    },
    SETTINGS: {
      audio_playback: true,
      quick_timer_start_value: 20, // in seconds
    },
    LAST_PRESET: last_preset || undefined,
    PRESETS: presets || template_presets,
    essentialLinks: [
      { titel: 'Home', caption: 'zurück', icon: 'home', route: 'Index' },
      { seperator: true },
      { titel: 'Über', caption: 'about', icon: 'info', route: 'About' },
      { titel: 'ChangeLog', caption: 'changelog', icon: 'info', route: 'ChangeLog' },
      { titel: 'Impressum', caption: '', icon: 'gavel', route: 'Impressum' },

    ]
  }
}
