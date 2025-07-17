import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.config.globalProperties.$log = (message) => {
    console.log(message)
    const api = app.config.globalProperties.$api
    if (api) {
      api.post('/log', { message }).catch(() => {})
    }
  }
})
