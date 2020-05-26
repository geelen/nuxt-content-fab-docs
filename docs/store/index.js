import Vue from 'vue'
import groupBy from 'lodash.groupby'

export const state = () => ({
  categories: {},
})

export const mutations = {
  SET_CATEGORIES(state, categories) {
    // Vue Reactivity rules since we add a nested object
    Vue.set(state.categories, this.$i18n.locale, categories)
  },
}

export const actions = {
  async fetchCategories({ commit, state }) {
    // Avoid re-fetching in production
    if (process.dev === false && state.categories[this.$i18n.locale]) {
      return
    }
    const docs = await getDocs(
      this,
      (query) =>
        query.only(['category', 'title', 'slug']).sortBy('position', 'asc'),
      (docs, subdir) => {
        docs.forEach((doc) => (doc.slug = `${subdir}/${doc.slug}`))
      }
    )

    const categories = groupBy(docs, 'category')

    commit('SET_CATEGORIES', categories)
  },
}

export const DIRECTORIES = ['', 'guides', 'kb', 'blog']

export const getDocs = async (that, filter_fn, subdir_fn) => {
  const docs = []
  await Promise.all(
    DIRECTORIES.map(async (subdir) => {
      const query = that.$content(
        `${that.$i18n.locale}${subdir ? `/${subdir}` : ''}`
      )
      const dir_docs = await filter_fn(query).fetch()
      console.log({ subdir, dir_docs })
      if (subdir && subdir_fn) subdir_fn(dir_docs, subdir)
      docs.push(...dir_docs)
    })
  )
  console.log({ docs })
  return docs
}
