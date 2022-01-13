// import Vue from 'vue';

import feedback from './src/lib/feedback/feedback.vue';
const components = [feedback];

const install = function (Vue) {
  if (install.installed) return;
  components.map((component) => Vue.component(component.name, component));
};

export default {
  install,
  feedback,
};
