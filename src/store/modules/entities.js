import * as types from '../mutation-types'
import Vue from 'vue'

const state = () => {
  return {
    entities: {},
    errors: {},
    fetchStatus: {}
  }
}

const mutations = {
  [types.ENTITIES](state, { entities, result, fetchStatus }) {
    for (let key of result) {
      Vue.set(state.entities, key, {
        ...state.entities[key],
        ...entities.items[key]
      })
      if (!state.fetchStatus[key]) {
        Vue.set(state.fetchStatus, key, fetchStatus[key])
      }
    }
  },
  [types.ENTITY_REQUEST](state, { result }) {
    Vue.set(state.fetchStatus, result, 'loading')
  },
  [types.ENTITY_SUCCESS](state, { entities, result }) {
    state.fetchStatus[result] = 'loaded'
    Vue.set(state.entities, result, {
      ...state.entities[result],
      ...entities.items[result]
    })
  },
  [types.ENTITY_FAILURE](state, { entities, result, error }) {
    state.fetchStatus[result] = 'failed'
    Vue.set(state.errors, result, error)
  }
}

export default {
  state,
  mutations
}
