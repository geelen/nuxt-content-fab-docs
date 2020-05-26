import Vue from 'vue'
import groupBy from 'lodash.groupby'

export const state = () => ({
  categories: {}
})

export const mutations = {
  SET_CATEGORIES(state, categories) {
    // Vue Reactivity rules since we add a nested object
    Vue.set(state.categories, this.$i18n.locale, categories)
  }
}

export const actions = {
  async fetchCategories({ commit, state }) {
    // Avoid re-fetching in production
    if (process.dev === false && state.categories[this.$i18n.locale]) {
      return
    }
    const docs = []
    await Promise.all(
      ['', '/guides'].map(async p => {
        const dir_docs = await this.$content(this.$i18n.locale + p)
          .only(['category', 'title', 'slug'])
          .sortBy('position', 'asc')
          .fetch()
        if (p) dir_docs.forEach(doc => doc.slug = `${p.slice(1)}/${doc.slug}`)
        docs.push(...dir_docs)
      })
    )
    console.log({ docs })
    const categories = groupBy(docs, 'category')

    commit('SET_CATEGORIES', categories)
  }
}
