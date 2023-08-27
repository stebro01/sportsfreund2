export function someMutation(/* state */) {
}

export function LOG(state, payload) {
  console.log(payload)
}

export function SET_SETTINGS_AUDIO_PLAYBACK(state, payload) {
  state.SETTINGS.audio_playback = payload
}

export function SET_SETTINGS_QUICK_TIMER_START_VALUE(state, payload) {
  state.SETTINGS.quick_timer_start_value = payload
}

export function SET_LAST_PRESET(state, payload) {
  LOG({}, { message: 'SET_LAST_PRESET' })
  window.localStorage.setItem('last_preset', JSON.stringify(payload))
  state.LAST_PRESET = payload
}

export function ADD_PRESET(state, payload) {
  LOG({}, { message: 'ADD_PRESET' })
  state.PRESETS.push(payload)
  window.localStorage.setItem('presets', JSON.stringify(state.PRESETS))
}

export function REMOVE_PRESET(state, payload) {
  LOG({}, { message: 'REMOVE_PRESET' })
  state.PRESETS = state.PRESETS.filter(preset => preset.label !== payload)
  window.localStorage.setItem('presets', JSON.stringify(state.PRESETS))
}
