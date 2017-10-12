// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import config from './config'

const logInCheck = () => {
  return localStorage.getItem('laa_uid')
}

router.beforeEach((to, from, next) =>
{
  store.commit('collapseSideMenu')
  store.commit('hideModal')
  const uid = logInCheck()
  if (uid){
    return next()
  }

  if ( (! uid && to.path !== '/') )
    return window.location = '/'

  // if (! store.getters.isLoggedIn && store.getters.pageCreated === true && to.path !== '/')
  //   return window.location.pathname = '/'
  next()
})

Vue.config.productionTip = false

Vue.mixin({
  computed: {
    isLoggedIn(){
      return logInCheck()
    },
    showHeader(){
      return this.$store.getters.showHeader
    }
  },
  data() {
    return {
      BASE_URL: config().base_url,
    }
  },
  methods: {
    genericErrorAlert() {
      const msg = 'An error occurred.'
      if (navigator.onLine === false)
        return alert(`${msg} Please check your internet connection.`)
      return alert(`${msg} Please try again.`)
    },
    // Custom response interceptor
    handleResponse(res, fn) {

      if (fn && typeof fn == 'function')
        fn(res)

      if (res.ok)
        return res.json()

      let e = new Error
      e.status = res.status
      e.headers = res.headers
      try {
        e.body = res.json()
      } catch (e) {
        console.log(e)
      }
      throw e
    },
    hideModal(e) {
      this.$store.commit('hideModal')
    },
    logout(){
      this.$store.commit('burn')
    },
    modalOpen() {
      return this.$store.getters.modalOpen
    },
    showModal(){
      this.$store.commit('showModal')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
