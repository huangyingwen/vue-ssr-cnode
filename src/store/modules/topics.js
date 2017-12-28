import fetch from 'node-fetch'
import Vue from 'vue'
import { normalize, schema } from 'normalizr'
import trimHtml from 'trim-html'
import { union } from 'lodash'
import * as types from '../mutation-types'
import entities from './entities'
import { baseUrl } from '../api'

const state = () => {
  return {
    ...entities.state(),
    paginates: {}
  }
}

// mutations
const mutations = {
  ...entities.mutations,

  [types.PAGINATE_REQUEST](state, { key }) {
    if (!state.paginates[key]) {
      Vue.set(state.paginates, key, {
        isFetching: false,
        page: 0,
        ids: [],
        isAllLoaded: false
      })
    }
    state.paginates[key].isFetching = true
  },

  [types.PAGINATE_SUCCESS](state, { key, result, page, totalPage }) {
    state.paginates[key].isFetching = false
    state.paginates[key].ids = union(
      page !== 1 ? state.paginates[key].ids : [],
      result
    )
    state.paginates[key].page = page
    state.paginates[key].isAllLoaded = page >= totalPage
  },

  [types.PAGINATE_FAILURE](state, { key }) {
    state.paginates[key].isFetching = false
  }
}

// schema
const topicSchema = new schema.Entity('items')

// actions
const actions = {
  fetchTopics({ commit, state }, { key, page }) {
    if (state.isFetching) return

    commit(types.PAGINATE_REQUEST, { key })

    return fetch(`${baseUrl}/topics?tab=${key}&page=${page}`)
      .then(res => res.json())
      .then(json => {
        json.data.forEach(a => {
          a.subtitle = trimHtml(a.content, {
            preserveTags: false,
            limit: 200
          }).html
        })
        const normalizedData = normalize(json.data, [topicSchema])

        let fetchStatus = {}
        normalizedData.result.forEach(a => {
          fetchStatus[a] = 'none'
        })

        commit(types.ENTITIES, { ...normalizedData, fetchStatus })
        commit(types.PAGINATE_SUCCESS, {
          key,
          ...normalizedData,
          page: page
        })
        return json
      })
      .catch(error => {
        commit(types.PAGINATE_FAILURE, { key, error })
        throw new Error(error)
      })
  },
  fetchTopicById({ commit, state }, id) {
    let status = state.fetchStatus[id]
    if (status && status !== 'none' && status !== 'failed') return
    commit(types.ENTITY_REQUEST, { result: id })
    return fetch(`${baseUrl}/topic/${id}`)
      .then(res => res.json())
      .then(json => {
        const normalizedData = normalize(json.data, topicSchema)
        console.log(normalizedData)
        commit(types.ENTITY_SUCCESS, normalizedData)
        return json
      })
      .catch(error => {
        commit(types.ENTITY_FAILURE, { result: id, error })
        throw error
      })
  }
}

// getters
const getters = {
  getById: (state, getters) => id => {
    return state.entities[id]
  },

  getByRouteId(state, getters, { route: { params: { id } } }) {
    return getters.getById(id) || {}
  },

  getItems: state => key => {
    return state.paginates[key].ids.map(id => state.entities[id])
  },

  getIsData: state => key => {
    return state.paginates[key].ids.length > 0
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
