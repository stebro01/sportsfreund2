import textTemplate from '../helper/textTemplate'

const state = {
  settings: [
    {
      // TIMER
      label: textTemplate[27],
      value: false,
      size_on: 50,
      size_off: 95,
      timeOn: 20,
      timeOff: 10,
      repeat: 5,
      playSound: false,
      playUrl: '../statics/gong.wav',
      playSoundVolume: 1
    },
    {
      // BEARBEITEN
      label: textTemplate[7],
      value: false
    },
    {
      // ADVANCED DB SETTINGS
      label: textTemplate[32],
      value: false
    },
    {
      // SAVE AUTO
      label: textTemplate[55],
      value: false
    }
  ],
  user: [],
  counter: 3,
  workout_template: {
    label: textTemplate[28],
    repeat: 50
  },
  workouts: []
}

export default state
