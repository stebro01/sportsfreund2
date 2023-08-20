import * as types from './mutation-types'
import * as settings from '../helper/settings'

export const deleteWorkout = ({ commit }, payload) => {
  commit(types.REMOVE_WORKOUT, payload)
}

export const addWorkout = ({ commit }, payload) => {
  commit(types.ADD_WORKOUT, payload)
}

export const updateWorkout = ({ commit }, payload) => {
  commit(types.UPDATE_WORKOUT, payload)
  if (settings.get({ name: 'auto_save', key: 'value' })) {
    commit(types.SAVE_DB_LOCAL, { storage: 'settings', data: undefined })
  }
}

// UPDATE TIMER SETTINGS
export const updateTimerSettings = ({ commit }, payload) => {
  commit(types.UPDATE_TIMER_SETTINGS, payload)
  if (settings.get({ name: 'auto_save', key: 'value' })) {
    commit(types.SAVE_DB_LOCAL, { storage: 'settings', data: undefined })
  }
}

// DB LOCAL
export const saveDBLocal = ({ commit }, payload) => {
  commit(types.SAVE_DB_LOCAL, payload)
}

export const loadDBLocal = ({ commit }, payload) => {
  commit(types.LOAD_DB_LOCAL, payload)
}

export const showDBLocal = ({ commit }, payload) => {
  commit(types.SHOW_DB_LOCAL, payload)
}

export const clearDBLocal = ({ commit }) => {
  commit(types.CLEAR_DB_LOCAL)
}

export const clearDBLocalSettings = ({ commit }) => {
  commit(types.CLEAR_DB_SETTINGS)
}

// USER Management
export const userLogin = ({ commit }, payload) => {
  commit(types.USER_LOGIN, payload)
}

export const userLogout = ({ commit }) => {
  commit(types.USER_LOGOUT)
}
