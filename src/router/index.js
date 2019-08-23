import Vue from 'vue';
import Router from 'vue-router';
import AnnoML from '@/views/AnnoML.vue';
import VisualizationPage from '@/views/VisualizationPage.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Visualization',
      component: VisualizationPage,
    },
    {
      path: '/annoml/:id',
      name: 'AnnoML',
      component: AnnoML,
      props: true,
    },
  ],
});
