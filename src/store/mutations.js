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
