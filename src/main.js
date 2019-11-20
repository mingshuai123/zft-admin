import Vue from 'vue'

// import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css
import '@/styles/main.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import axiosApi from '@/utils/fetch'
Vue.use(axiosApi)

import axios from 'axios';
axios.defaults.headers = {
	"Content-Type": "application/json"
};
Vue.prototype.$axios=axios;
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock';
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
// Vue.use(Element, {
//   size: Cookies.get('size') || 'medium' // set element-ui default size
// })
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
Vue.prototype.roletype=
{
  '1':'管理员','2':'审核员','3':'星评员', '4':'星评管理员',  '5':'星评超级管理员', '6':'全国星评','7':'业主'
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
