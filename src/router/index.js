// npm install vue-router@next
import { createRouter, createWebHistory } from 'vue-router';
import AdminIndex from '../views/AdminIndex.vue';
import TeaIndex from '../views/TeaIndex.vue';
import ElementVue from '../views/Element.vue';
import MyIntroduced from '../views/MyIntroduced.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/adminIndex',
    name: 'AdminIndex',
    component: AdminIndex
  },
  {
    path: '/teaIndex',
    name: 'TeaIndex',
    component: TeaIndex
  },
  {
    path: '/element',
    name: 'ElementVue',
    component: ElementVue,
  },
  {
    path: '/myIntroduced',
    name: 'MyIntroduced',
    component: MyIntroduced
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
