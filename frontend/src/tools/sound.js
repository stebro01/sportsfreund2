import { Platform } from 'quasar'
import createSoundMap from './soundMap.js'
import gong from 'assets/sounds/gong.wav'
import beepbeepbeep_1s from 'assets/sounds/beepbeepbeep_1s.wav'
import beep_1s from 'assets/sounds/beep_1s.wav'
import tada from 'assets/sounds/tada.wav'

const soundMap = createSoundMap({ gong, beepbeepbeep_1s, beep_1s, tada })

export default function playSound (name, enabled = true) {
  if (!enabled) return

  if (Platform.is.cordova) {
    const path = cordova.file.applicationDirectory + 'www/media/' + name + '.wav'
    const myMedia = new Media(
      path,
      function () { console.log('Audio Success') },
      function (err) { console.log('Audio Error: ' + err.code) }
    )
    myMedia.play()
    return
  }

  const audio = new Audio(soundMap[name])
  audio.play({ playAudioWhenScreenIsLocked: true })
}
