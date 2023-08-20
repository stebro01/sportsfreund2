/* eslint-disable camelcase */
import * as types from './mutation-types'
import Workout from './Workout'

import LOG from '../helper/my_log'

import * as LOCALDB from './localDB'
import * as auth from '../auth/auth'

export const mutations = {
  [types.REMOVE_WORKOUT] (state, payload) {
    state.workouts.splice(payload, 1)
  },

  [types.ADD_WORKOUT] (state, payload) {
    state.counter++
    const workout = new Workout(payload.label, payload.goal, 0, 1, 10, state.counter)
    state.workouts.push(workout)
  },

  [types.UPDATE_WORKOUT] (state, payload) {
    LOG('UPDATE_WORKOUT', payload)
    const index = payload.index
    state.workouts[index][payload.key] = payload.value
  },

  // UPDATE TIMER SETTINGS
  [types.UPDATE_TIMER_SETTINGS] (state, payload) {
    state.settings[0].timeOn = payload.actionTime
    state.settings[0].timeOff = payload.breakTime
    state.settings[0].repeat = payload.repeat
  },

  // Local DB
  [types.SAVE_DB_LOCAL] (state, payload) {
    var data = {}
    var mode = 'add'
    if (payload.storage === LOCALDB.labelSettings) {
      data = {
        'settings': JSON.stringify(prepareSettings(state)),
        'date': LOCALDB.makeDate(),
        'id': 0
      }
      mode = 'update'
    } else {
      data = {
        'workout': payload.data.workout,
        'repeat': payload.data.repeat,
        'date': LOCALDB.makeDate()
      }
    }
    LOG('Speichere DB', data)
    LOCALDB.saveDB(payload.storage, data, mode)
  },

  [types.LOAD_DB_LOCAL] (state, payload) {
    LOCALDB.loadDB(payload.storage)
      .then((res) => {
        LOG('LoadDB', res)
        if (payload.storage === LOCALDB.labelSettings) {
          if (res.length > 0) {
            const localDATA = JSON.parse(res[0].settings)
            LOG('load settings', localDATA)
            loadSettingsFromJSON(state, localDATA)
          } else {
            LOG('No valid data found in DB')
          }
        }
      })
  },

  [types.SHOW_DB_LOCAL] (state, payload) {
    LOG('Show DB:', LOCALDB.labelLocalDB, 'in Storage:', payload.storage)
    LOCALDB.loadDB(payload.storage)
      .then((res) => LOG(res))
  },

  [types.CLEAR_DB_LOCAL] (state) {
    LOG('CLEAR DB: ', LOCALDB.labelLocalDB)
    LOCALDB.clearDB()
  },

  [types.CLEAR_DB_SETTINGS] (state) {
    LOG('CLEAR local Settings: ', LOCALDB.labelLocalDB)
    LOCALDB.openDB()
      .then(db => {
        db.open()
          .then(db => {
            db[LOCALDB.labelSettings].clear()
          })
      })
  },

  // USER LOGIN / OUT
  [types.USER_LOGIN] (state, payload) {
    LOG('USER_LOGIN:', payload)
    auth.userLogin(payload)
  },
  [types.USER_LOGOUT] (state) {
    LOG('USER_LOGOUT')
    auth.userLogout()
  }
}

// eslint-disable-next-line no-unused-vars
function loadSettingsFromJSON (state, localDATA) {
  if (localDATA !== null) {
    state.counter = localDATA.counter
    state.settings = localDATA.settings
    state.workouts = localDATA.workouts
  } else {
    // KEINE SESSION gespeichert
  }
}

function prepareSettings (state) {
  var localDATA = {
    counter: state.counter,
    settings: state.settings,
    workouts: state.workouts
  }
  return localDATA
}
