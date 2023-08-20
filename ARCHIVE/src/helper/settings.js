/* eslint-disable no-unreachable */
import state from '../store/state'

export function get (value) {
  switch (value.name) {
    case 'timer':
      return state.settings[0][value.key]
      break
    case 'edit':
      return state.settings[1][value.key]
      break
    case 'edit_db':
      return state.settings[2][value.key]
      break
    case 'auto_save':
      return state.settings[3][value.key]
      break
    default:
      return []
  }
}
