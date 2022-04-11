import Vue from 'vue'
import ElementUI from 'element-ui';
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
// eslint-disable-next-line
new Vue({
  el: '#app',
  render: (h) => h(App),
})
