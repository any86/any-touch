import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@5a/css';
Vue.config.productionTip = false
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload,{
  loading: './loading.gif'
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
