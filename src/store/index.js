import { createStore } from 'vuex'
import { Notify } from 'quasar'

Notify.setDefaults({ timeout: 250 })

import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'


export default createStore({
  state,
  getters,
  mutations,
  actions

})
