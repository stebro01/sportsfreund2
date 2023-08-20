import Vue from 'vue'
import Vuex from 'vuex'

import { mutations } from './mutations'
import * as actions from './actions'
import state from './state'

import firebase from 'firebase/app'
import * as auth from '../auth/auth'

firebase.initializeApp(auth.firebaseConfig)

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions
})
