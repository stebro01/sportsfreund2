export function ESSENTIAL_LINKS(state) {
  return state.essentialLinks
}

export function ENV(state) {
  return state.ENV
}

export function SETTINGS(state) {
  return state.SETTINGS
}

export function LAST_PRESET(state) {
  if (state.LAST_PRESET) {
    return state.LAST_PRESET
  } else {
    return {
      action: { value: 5, unit: 's' },
      break: { value: 2, unit: 's' },
      exercises: { value: 2, unit: 'x' },
      rounds: { value: 2, unit: 'x' },
      round_break: { value: 10, unit: 's' },
      label: 'Default'
    }
  }
}

export function PRESETS(state) {
  return state.PRESETS
}
