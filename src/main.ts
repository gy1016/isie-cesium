import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from '@/router';
import pinia from '@/store';
import App from './App.vue';
// import '@/styles/index.scss'

createApp(App).use(ElementPlus).use(pinia).use(router).mount('#app');
