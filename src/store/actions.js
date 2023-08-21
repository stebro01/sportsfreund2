export function someAction({ commit, state }, payload) {
  commit('LOG', { method: 'someAction', payload: payload })
}

