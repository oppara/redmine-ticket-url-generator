import Vue from 'vue';
import App from './App.vue';
import locale from 'element-ui/lib/locale';
import lang from 'element-ui/lib/locale/lang/ja';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

locale.use(lang);

new Vue({
  render: h => h(App),
}).$mount('#app');
